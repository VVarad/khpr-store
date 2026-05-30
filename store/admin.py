from django.contrib import admin
from django.utils import timezone
from django.db.models import Sum
from .models import Category, Product, ProductSize, Customer, Order, OrderItem

admin.site.site_header = "KHPR Admin"
admin.site.site_title = "KHPR Management"
admin.site.index_title = "Store Management"

class ProductSizeInline(admin.TabularInline):
    model = ProductSize
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'is_active', 'created_at')
    list_editable = ('is_active', 'price')
    search_fields = ('name', 'story')
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ProductSizeInline]

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_at')
    prepopulated_fields = {"slug": ("name",)}

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'size', 'quantity', 'unit_price')
    can_delete = False

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'get_customer_email', 'total_amount', 'status', 'is_paid', 'created_at')
    list_editable = ('status',)
    list_filter = ('status', 'is_paid')
    search_fields = ('order_id', 'customer__user__email')
    inlines = [OrderItemInline]
    readonly_fields = ('razorpay_order_id', 'razorpay_payment_id', 'shipping_address', 'total_amount')

    def get_customer_email(self, obj):
        return obj.customer.user.email if obj.customer else 'N/A'
    get_customer_email.short_description = 'Customer Email'

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('get_full_name', 'get_email', 'phone', 'city')
    search_fields = ('user__email', 'phone', 'user__first_name', 'user__last_name')

    def get_full_name(self, obj):
        return obj.user.get_full_name()
    get_full_name.short_description = 'Full Name'

    def get_email(self, obj):
        return obj.user.email
    get_email.short_description = 'Email'

# Custom admin index view logic
original_index = admin.site.index

def custom_index(request, extra_context=None):
    now = timezone.now()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    total_orders_today = Order.objects.filter(created_at__gte=today_start).count()
    revenue_this_month = Order.objects.filter(
        created_at__gte=month_start, is_paid=True
    ).aggregate(Sum('total_amount'))['total_amount__sum'] or 0
    low_stock_products = ProductSize.objects.filter(stock__lt=5).select_related('product')
    recent_orders = Order.objects.all().order_by('-created_at')[:5]

    extra_context = extra_context or {}
    extra_context.update({
        'total_orders_today': total_orders_today,
        'revenue_this_month': revenue_this_month,
        'low_stock_products': low_stock_products,
        'recent_orders': recent_orders,
    })
    return original_index(request, extra_context)

admin.site.index = custom_index
