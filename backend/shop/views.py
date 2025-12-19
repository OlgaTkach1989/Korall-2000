from django.contrib.auth import login
from django.contrib.auth.models import AnonymousUser
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response

from .models import Order, OrderItem, Product
from .serializers import (
    LoginSerializer,
    OrderItemSerializer,
    OrderSerializer,
    ProductSerializer,
    RegisterSerializer,
    UserSerializer,
)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    lookup_field = "slug"
    permission_classes = [permissions.AllowAny]


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().prefetch_related("items", "items__product")
    serializer_class = OrderSerializer

    def get_permissions(self):
        if self.action in ["partial_update", "update"]:
            return [permissions.IsAdminUser()]
        if self.action == "list":
            return [permissions.AllowAny()]
        return [permissions.AllowAny()]

    def destroy(self, request, *args, **kwargs):
        order = self.get_object()
        
        if order.status != Order.OrderStatus.COMPLETED:
            return Response(
                {"detail": "Nur abgeschlossene Bestellungen können gelöscht werden."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAdminUser])
    def update_status(self, request, pk=None):
        order = self.get_object()
        status_value = request.data.get("status")
        if status_value not in dict(Order.OrderStatus.choices):
            return Response({"detail": "Ungültiger Status"}, status=status.HTTP_400_BAD_REQUEST)
        order.status = status_value
        order.save(update_fields=["status"])
        serializer = self.get_serializer(order)
        return Response(serializer.data)


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.validated_data["user"]
    allowed = {"helen.haveloh@techstarter.de", "olgakalinicenko378@gmail.com"}
    username_lower = (user.username or "").lower()
    email_lower = (user.email or "").lower()
    if not (user.is_staff or user.is_superuser) or (
        username_lower not in {a.lower() for a in allowed}
        and email_lower not in {a.lower() for a in allowed}
    ):
        return Response({"detail": "Kein Zugriff. Nur freigegebene Manager."}, status=status.HTTP_403_FORBIDDEN)
    if not isinstance(request.user, AnonymousUser):
        login(request, user)
    return Response(UserSerializer(user).data)


@api_view(["GET"])
@permission_classes([permissions.IsAdminUser])
def dashboard_summary(request):
    orders = Order.objects.all()
    status_counts = {key: orders.filter(status=key).count() for key, _ in Order.OrderStatus.choices}
    latest = OrderSerializer(orders[:5], many=True).data
    return Response(
        {
            "total_orders": orders.count(),
            "status_counts": status_counts,
            "latest": latest,
        }
    )


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def homepage_features(request):
    features = [
        {"title": "Schnelle Produktion", "description": "Lieferung innerhalb weniger Tage."},
        {"title": "Individuelle Größen", "description": "Produktion passend zu Ihrem Bedarf."},
        {"title": "Faire Preise", "description": "Direkt vom Hersteller."},
    ]
    return Response({"features": features})
