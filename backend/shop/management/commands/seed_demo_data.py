from django.core.management.base import BaseCommand

from shop.models import Order, OrderItem, Product


class Command(BaseCommand):
    help = "Populate the database with demo products and an example order."

    def handle(self, *args, **options):
        products = [
            {
                "name": "Plastiktüte Standard",
                "slug": "plastiktuete-standard",
                "short_description": "Allrounder für den täglichen Gebrauch",
                "description": "Hochwertige Polyethylen-Tragetaschen mit verstärkten Griffen.",
                "price": 0.12,
                "minimum_price": 0.09,
                "lead_time_days": 5,
            },
            {
                "name": "Plastiktüte Premium",
                "slug": "plastiktuete-premium",
                "short_description": "Dickeres Material und Logo-Druck",
                "description": "Premiumqualität für Markenauftritte inklusive Logodruck.",
                "price": 0.18,
                "minimum_price": 0.12,
                "lead_time_days": 7,
            },
            {
                "name": "Plastiktüte XL",
                "slug": "plastiktuete-xl",
                "short_description": "Für große und schwere Produkte",
                "description": "Extra verstärkte Henkel und mehr Volumen.",
                "price": 0.25,
                "minimum_price": 0.15,
                "lead_time_days": 10,
            },
        ]

        created_products = []
        for data in products:
            obj, _ = Product.objects.update_or_create(slug=data["slug"], defaults=data)
            created_products.append(obj)

        first = created_products[0]
        order, _ = Order.objects.get_or_create(
            contact_email="demo@korall2000.de",
            defaults={
                "first_name": "Marta",
                "last_name": "Müller",
                "delivery_type": Order.DeliveryOptions.DELIVERY,
                "street": "Industriestraße",
                "house_number": "5",
                "postal_code": "20095",
                "city": "Hamburg",
            },
        )
        OrderItem.objects.get_or_create(
            order=order,
            product=first,
            defaults={"quantity": 100, "unit_price": first.price},
        )
        self.stdout.write(self.style.SUCCESS("Demo data seeded."))
