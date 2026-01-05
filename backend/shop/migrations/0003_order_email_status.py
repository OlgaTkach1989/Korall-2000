from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("shop", "0002_order_is_deleted"),
    ]

    operations = [
        migrations.AddField(
            model_name="order",
            name="last_email_status",
            field=models.CharField(default="pending", max_length=20),
        ),
        migrations.AddField(
            model_name="order",
            name="last_email_error",
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name="order",
            name="last_email_attempt_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
