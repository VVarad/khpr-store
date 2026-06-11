from django.shortcuts import get_object_or_404
from django.conf import settings
from rest_framework import generics, status, views, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
import razorpay
import hmac
import hashlib

from .models import Category, Product, ProductSize, Customer, Order, OrderItem
from .serializers import (
    CategorySerializer, ProductListSerializer, ProductDetailSerializer,
    UserSerializer, CustomerSerializer, OrderSerializer
)

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class ProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = ProductListSerializer
    permission_classes = [permissions.AllowAny]

class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductDetailSerializer
    lookup_field = 'slug'
    permission_classes = [permissions.AllowAny]

class RegisterView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        user_data = {
            'username': request.data.get('email'), # using email as username
            'email': request.data.get('email'),
            'password': request.data.get('password'),
            'first_name': request.data.get('first_name', ''),
            'last_name': request.data.get('last_name', '')
        }
        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid():
            user = user_serializer.save()
            
            # Create Customer profile
            Customer.objects.create(
                user=user,
                phone=request.data.get('phone', ''),
                address_line1=request.data.get('address_line1', ''),
                address_line2=request.data.get('address_line2', ''),
                city=request.data.get('city', ''),
                state=request.data.get('state', ''),
                pincode=request.data.get('pincode', '')
            )
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': user_serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        customer, created = Customer.objects.get_or_create(user=self.request.user)
        return customer

class OrderCreateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cart_items = request.data.get('items', [])
        if not cart_items:
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
        
        customer = get_object_or_404(Customer, user=request.user)
        
        total_amount = 0
        items_to_create = []
        
        # Calculate total and prepare items
        for item in cart_items:
            product = get_object_or_404(Product, id=item.get('product_id'))
            size = item.get('size')
            quantity = item.get('quantity', 1)
            
            # Check stock
            product_size = get_object_or_404(ProductSize, product=product, size=size)
            if product_size.stock < quantity:
                return Response({'error': f'Not enough stock for {product.name} ({size})'}, status=status.HTTP_400_BAD_REQUEST)
            
            unit_price = product.price
            total_amount += unit_price * quantity
            items_to_create.append({
                'product': product,
                'size': size,
                'quantity': quantity,
                'unit_price': unit_price
            })
            
        # Snapshot of address
        shipping_address = {
            'phone': customer.phone,
            'address_line1': customer.address_line1,
            'address_line2': customer.address_line2,
            'city': customer.city,
            'state': customer.state,
            'pincode': customer.pincode
        }
        
        # Create Order
        order = Order.objects.create(
            customer=customer,
            total_amount=total_amount,
            shipping_address=shipping_address
        )
        
        for item in items_to_create:
            OrderItem.objects.create(
                order=order,
                product=item['product'],
                size=item['size'],
                quantity=item['quantity'],
                unit_price=item['unit_price']
            )
            
        # Create Razorpay Order
        if getattr(settings, 'RAZORPAY_KEY_ID', None):
            try:
                client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
                # amount is in paise
                rzp_order = client.order.create({
                    "amount": int(total_amount * 100),
                    "currency": "INR",
                    "receipt": order.order_id
                })
                order.razorpay_order_id = rzp_order['id']
                order.save()
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        return Response({
            'order_id': order.order_id,
            'razorpay_order_id': order.razorpay_order_id,
            'amount': total_amount,
            'currency': 'INR',
            'key_id': getattr(settings, 'RAZORPAY_KEY_ID', '')
        }, status=status.HTTP_201_CREATED)

class OrderVerifyPaymentView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_signature = request.data.get('razorpay_signature')
        
        if not all([razorpay_order_id, razorpay_payment_id, razorpay_signature]):
            return Response({'error': 'Missing payment details'}, status=status.HTTP_400_BAD_REQUEST)
            
        order = get_object_or_404(Order, razorpay_order_id=razorpay_order_id)
        
        # Verify HMAC signature
        secret = settings.RAZORPAY_KEY_SECRET
        msg = f"{razorpay_order_id}|{razorpay_payment_id}"
        generated_signature = hmac.new(
            secret.encode(), msg.encode(), hashlib.sha256
        ).hexdigest()
        
        if generated_signature == razorpay_signature:
            # Payment successful
            order.is_paid = True
            order.razorpay_payment_id = razorpay_payment_id
            order.status = 'CONFIRMED'
            order.save()
            
            # Reduce stock
            for item in order.items.all():
                try:
                    product_size = ProductSize.objects.get(product=item.product, size=item.size)
                    if product_size.stock >= item.quantity:
                        product_size.stock -= item.quantity
                        product_size.save()
                except ProductSize.DoesNotExist:
                    pass
                    
            return Response({'status': 'Payment verified successfully'})
        else:
            return Response({'error': 'Invalid signature'}, status=status.HTTP_400_BAD_REQUEST)

class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        customer = get_object_or_404(Customer, user=self.request.user)
        return Order.objects.filter(customer=customer).order_by('-created_at')

class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'order_id'

    def get_queryset(self):
        customer = get_object_or_404(Customer, user=self.request.user)
        return Order.objects.filter(customer=customer)
