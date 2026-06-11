import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'khpr_backend.settings')
django.setup()

from django.test import RequestFactory
from django.contrib.auth.models import User
from store.models import Customer
from store.views import ProfileView
from rest_framework.test import APIRequestFactory, force_authenticate

user = User.objects.get(username='test_checkout_user')

factory = APIRequestFactory()
data = {
    'user': {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': '',
        'last_name': ''
    },
    'phone': '8888888888',
    'address_line1': 'New Address 2',
    'address_line2': '',
    'city': 'Pune',
    'state': 'MH',
    'pincode': '411001'
}
request = factory.put('/api/auth/profile/', data, format='json')
force_authenticate(request, user=user)

view = ProfileView.as_view()
response = view(request)
print("Response Status:", response.status_code)
print("Response Data:", response.data)

