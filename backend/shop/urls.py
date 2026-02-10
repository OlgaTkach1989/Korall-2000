from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    chatbot_view,
    OrderViewSet,
    ProductViewSet,
    dashboard_summary,
    homepage_features,
    login_view,
    register_view,
)

router = DefaultRouter()
router.register("products", ProductViewSet, basename="product")
router.register("orders", OrderViewSet, basename="order")

urlpatterns = [
    path("", include(router.urls)),
    path("auth/register/", register_view, name="register"),
    path("auth/login/", login_view, name="login"),
    path("dashboard/summary/", dashboard_summary, name="dashboard-summary"),
    path("homepage/features/", homepage_features, name="homepage-features"),
    path("chatbot/", chatbot_view, name="chatbot"),
]
