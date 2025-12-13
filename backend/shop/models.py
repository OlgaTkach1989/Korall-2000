from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Product(TimeStampedModel):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True)
    short_description = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    minimum_price = models.DecimalField(
        max_digits=8, decimal_places=2, help_text="Display price per item"
    )
    lead_time_days = models.PositiveIntegerField(default=5)
    is_active = models.BooleanField(default=True)
    image_url = models.URLField(blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class Order(TimeStampedModel):
    class OrderStatus(models.TextChoices):
        NEW = "new", "Neu"
        IN_PROGRESS = "processing", "In Bearbeitung"
        SHIPPED = "shipped", "Versandt"
        COMPLETED = "completed", "Abgeschlossen"

    class DeliveryOptions(models.TextChoices):
        DELIVERY = "delivery", "Lieferung"
        PICKUP = "pickup", "Abholung"

    customer = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="orders"
    )
    contact_email = models.EmailField()
    delivery_type = models.CharField(
        max_length=20,
        choices=DeliveryOptions.choices,
        default=DeliveryOptions.DELIVERY,
    )
    first_name = models.CharField(max_length=120)
    last_name = models.CharField(max_length=120)
    street = models.CharField(max_length=200, blank=True)
    house_number = models.CharField(max_length=20, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    city = models.CharField(max_length=120, blank=True)
    status = models.CharField(
        max_length=20, choices=OrderStatus.choices, default=OrderStatus.NEW
    )
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"Order #{self.id or 'neu'}"

    @property
    def total(self):
        return sum(item.subtotal for item in self.items.all())


class OrderItem(TimeStampedModel):
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name="items"
    )
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=8, decimal_places=2)

    class Meta:
        unique_together = ("order", "product")

    def __str__(self):
        return f"{self.product.name} ({self.quantity})"

    @property
    def subtotal(self):
        return self.quantity * self.unit_price
