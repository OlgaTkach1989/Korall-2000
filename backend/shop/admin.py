from django.contrib import admin

from .models import Order, OrderItem, Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "minimum_price", "lead_time_days", "is_active")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "contact_email",
        "status_display",
        "delivery_type",
        "created_at",
        "last_email_status",
        "last_email_attempt_at",
    )
    list_filter = ("status", "delivery_type", "last_email_status")
    search_fields = ("contact_email", "first_name", "last_name")
    inlines = [OrderItemInline]

    def status_display(self, obj):
        if obj.is_deleted:
            return "Gelöscht"
        return obj.get_status_display()

    status_display.short_description = "Status"
