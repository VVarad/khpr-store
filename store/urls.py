from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    CategoryListView, ProductListView, ProductDetailView,
    RegisterView, ProfileView, OrderCreateView, OrderVerifyPaymentView,
    OrderListView, OrderDetailView
)

urlpatterns = [
    # Public
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/<slug:slug>/', ProductDetailView.as_view(), name='product-detail'),
    path('categories/', CategoryListView.as_view(), name='category-list'),

    # Auth
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/', ProfileView.as_view(), name='profile'),

    # Orders
    path('orders/create/', OrderCreateView.as_view(), name='order-create'),
    path('orders/verify-payment/', OrderVerifyPaymentView.as_view(), name='order-verify-payment'),
    path('orders/my-orders/', OrderListView.as_view(), name='order-list'),
    path('orders/<str:order_id>/', OrderDetailView.as_view(), name='order-detail'),
]
