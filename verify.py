import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'khpr_backend.settings')
django.setup()

from django.test import Client
from store.models import Category, Product, ProductSize, Customer, Order, OrderItem
from django.contrib.auth.models import User

# Clean DB before test
User.objects.all().delete()
Category.objects.all().delete()

# 1. Setup test data
category = Category.objects.create(name='Test Category', slug='test-cat')
product = Product.objects.create(
    name='Test Product', slug='test-prod', category=category,
    description='desc', story='story', price=100.00
)
ProductSize.objects.create(product=product, size='L', stock=10)

client = Client(SERVER_NAME='localhost')

print("--- Testing API Endpoints ---")
# 2. Test Products API
response = client.get('/api/products/')
print("GET /api/products/ Status:", response.status_code)
if response.status_code == 200:
    print(f"Total Products found: {len(response.json())}")

# 3. Test Register
data = {
    'email': 'testuser@example.com',
    'password': 'password123',
    'first_name': 'Test',
    'last_name': 'User',
    'phone': '1234567890'
}
response = client.post('/api/auth/register/', data, content_type='application/json')
print("\nPOST /api/auth/register/ Status:", response.status_code)
if response.status_code == 201:
    print("Tokens generated successfully")
else:
    print("Response:", response.json())

# 4. Test Login
response = client.post('/api/auth/login/', {'username': 'testuser@example.com', 'password': 'password123'}, content_type='application/json')
print("\nPOST /api/auth/login/ Status:", response.status_code)

if response.status_code == 200:
    token = response.json()['access']
    
    # 5. Test Profile
    response = client.get('/api/auth/profile/', HTTP_AUTHORIZATION=f'Bearer {token}')
    print("\nGET /api/auth/profile/ Status:", response.status_code)
    
    # 6. Test Order Creation
    order_data = {
        'items': [
            {'product_id': product.id, 'size': 'L', 'quantity': 2}
        ]
    }
    response = client.post('/api/orders/create/', order_data, content_type='application/json', HTTP_AUTHORIZATION=f'Bearer {token}')
    print("\nPOST /api/orders/create/ Status:", response.status_code)
    print("Response:", response.json())
    
print("\n-----------------------------")
print("Verification complete.")
