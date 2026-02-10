import re

from django.contrib.auth import login
from django.contrib.auth.models import AnonymousUser
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response

from .chatbot import try_llm_reply
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
        order.is_deleted = True
        if order.status != Order.OrderStatus.COMPLETED:
            order.status = Order.OrderStatus.COMPLETED
        order.save(update_fields=["is_deleted", "status"])
        return Response(status=status.HTTP_204_NO_CONTENT)

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
    allowed = {
        "olga.tkachuk@tn.techstarter.de",
    }
    username_lower = (user.username or "").lower()
    email_lower = (user.email or "").lower()
    if not (user.is_staff or user.is_superuser) or (
        username_lower not in {a.lower() for a in allowed}
        and email_lower not in {a.lower() for a in allowed}
    ):
        return Response({"detail": "Kein Zugriff. Nur freigegebene Manager."}, status=status.HTTP_403_FORBIDDEN)
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


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def chatbot_view(request):
    message = (request.data.get("message") or "").strip()
    language = (request.data.get("language") or "de").lower()

    if not message:
        reply = (
            "Bitte schreiben Sie Ihre Frage."
            if language == "de"
            else "Please type your question."
        )
        return Response({"reply": reply, "suggestions": [], "source": "rules"})

    text = message.lower()
    suggestions = []

    if any(word in text for word in ["hallo", "hi", "hello"]):
        reply = (
            "Hallo! Ich kann bei Produkten, Versand und Bestellstatus helfen."
            if language == "de"
            else "Hi! I can help with products, shipping, and order status."
        )
        suggestions = [
            "Versandkosten",
            "Lieferzeit",
            "Status Bestellung #1",
        ]
        return Response({"reply": reply, "suggestions": suggestions, "source": "rules"})

    if any(word in text for word in ["versand", "shipping", "lieferung"]):
        reply = (
            "Versand kostet 4.00 EUR. Ab 100 EUR Warenwert ist der Versand kostenlos."
            if language == "de"
            else "Shipping is 4.00 EUR. Shipping is free from 100 EUR subtotal."
        )
        suggestions = ["Lieferzeit", "Produkte anzeigen", "Status Bestellung #1"]
        return Response({"reply": reply, "suggestions": suggestions, "source": "rules"})

    if any(word in text for word in ["lieferzeit", "lead time", "delivery time"]):
        avg_days = (
            Product.objects.filter(is_active=True)
            .values_list("lead_time_days", flat=True)
            .order_by("lead_time_days")
            .first()
            or 5
        )
        reply = (
            f"Die schnellste Lieferzeit beginnt ab ca. {avg_days} Tagen."
            if language == "de"
            else f"The fastest lead time starts from about {avg_days} days."
        )
        suggestions = ["Versandkosten", "Produkte anzeigen", "Status Bestellung #1"]
        return Response({"reply": reply, "suggestions": suggestions, "source": "rules"})

    if (
        any(word in text for word in ["schwere", "schwer", "heavy"])
        and any(
            word in text
            for word in ["produkt", "produkte", "product", "verpackung", "packaging"]
        )
    ):
        nass_product = Product.objects.filter(is_active=True, name__icontains="nass").first()
        if nass_product:
            reply = (
                f"Fuer schwere Produkte empfehle ich: {nass_product.name} (ab {nass_product.minimum_price} EUR)."
                if language == "de"
                else f"For heavy products I recommend: {nass_product.name} (from {nass_product.minimum_price} EUR)."
            )
        else:
            reply = (
                "Fuer schwere Produkte empfehle ich die NASS Tragetuete."
                if language == "de"
                else "For heavy products I recommend the NASS carrier bag."
            )
        suggestions = ["Produkte anzeigen", "Versandkosten", "Lieferzeit"]
        return Response({"reply": reply, "suggestions": suggestions, "source": "rules"})

    if any(word in text for word in ["produkt", "produkte", "product", "products"]):
        products = Product.objects.filter(is_active=True).order_by("minimum_price")[:5]
        if products:
            rows = [f"- {p.name} (ab {p.minimum_price} EUR)" for p in products]
            header = (
                "Hier sind einige Produkte:"
                if language == "de"
                else "Here are some products:"
            )
            reply = f"{header}\n" + "\n".join(rows)
        else:
            reply = (
                "Aktuell sind keine Produkte verfügbar."
                if language == "de"
                else "No products are available right now."
            )
        suggestions = ["Versandkosten", "Lieferzeit", "Status Bestellung #1"]
        return Response({"reply": reply, "suggestions": suggestions, "source": "rules"})

    id_match = re.search(r"#?\s*(\d+)", text)
    if any(word in text for word in ["status", "bestellung", "order"]) and id_match:
        order_id = int(id_match.group(1))
        order = Order.objects.filter(id=order_id).first()
        if order:
            status_display = order.get_status_display()
            delivery_display = order.get_delivery_type_display()
            reply = (
                f"Bestellung #{order.id}: Status '{status_display}', Versandart '{delivery_display}'."
                if language == "de"
                else f"Order #{order.id}: status '{status_display}', delivery type '{delivery_display}'."
            )
        else:
            reply = (
                f"Ich habe keine Bestellung mit der Nummer #{order_id} gefunden."
                if language == "de"
                else f"I could not find an order with number #{order_id}."
            )
        suggestions = ["Versandkosten", "Lieferzeit", "Produkte anzeigen"]
        return Response({"reply": reply, "suggestions": suggestions, "source": "rules"})

    email_match = re.search(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", message)
    if email_match:
        email = email_match.group(0)
        latest_order = Order.objects.filter(contact_email__iexact=email).first()
        if latest_order:
            reply = (
                f"Letzte Bestellung fuer {email}: #{latest_order.id}, Status '{latest_order.get_status_display()}'."
                if language == "de"
                else f"Latest order for {email}: #{latest_order.id}, status '{latest_order.get_status_display()}'."
            )
        else:
            reply = (
                f"Fuer {email} habe ich noch keine Bestellung gefunden."
                if language == "de"
                else f"I could not find any order for {email} yet."
            )
        suggestions = ["Status Bestellung #1", "Versandkosten", "Lieferzeit"]
        return Response({"reply": reply, "suggestions": suggestions, "source": "rules"})

    product_context = Product.objects.filter(is_active=True).order_by("minimum_price")[:5]
    context_text = "\n".join(
        [f"- {product.name}: from {product.minimum_price} EUR" for product in product_context]
    )
    llm_reply, llm_error = try_llm_reply(
        message=message,
        language=language,
        context_text=context_text,
    )
    if llm_reply:
        suggestions = ["Versandkosten", "Lieferzeit", "Status Bestellung #1"]
        return Response({"reply": llm_reply, "suggestions": suggestions, "source": "llm"})

    reply = (
        "Das habe ich nicht ganz verstanden. Fragen Sie z.B. nach Versand, Lieferzeit, Produkten oder Status mit Bestellnummer."
        if language == "de"
        else "I did not fully understand that. You can ask about shipping, lead time, products, or order status with an order number."
    )
    suggestions = ["Versandkosten", "Lieferzeit", "Status Bestellung #1"]
    return Response(
        {
            "reply": reply,
            "suggestions": suggestions,
            "source": "rules",
            "llm_error": llm_error,
        }
    )
