from django.contrib.auth import authenticate, get_user_model
from django.utils.crypto import get_random_string
from rest_framework import serializers

from .models import Order, OrderItem, Product

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "email"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ["username", "email", "password", "first_name", "last_name"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get("username") or attrs.get("email")
        user = authenticate(username=username, password=attrs["password"])
        if not user:
            raise serializers.ValidationError("Ungültige Zugangsdaten.")
        attrs["user"] = user
        return attrs


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "short_description",
            "description",
            "price",
            "minimum_price",
            "lead_time_days",
            "image_url",
        ]


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source="product", write_only=True
    )

    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "product_id",
            "quantity",
            "unit_price",
            "subtotal",
        ]

    def get_subtotal(self, obj):
        return obj.subtotal


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    total = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id",
            "contact_email",
            "status",
            "delivery_type",
            "first_name",
            "last_name",
            "street",
            "house_number",
            "postal_code",
            "city",
            "notes",
            "created_at",
            "items",
            "total",
        ]

    def get_total(self, obj):
        return obj.total

    def create(self, validated_data):
        items_data = validated_data.pop("items", [])
        user = self.context.get("request").user
        customer = user if user and user.is_authenticated else None
        order = Order.objects.create(customer=customer, **validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order
