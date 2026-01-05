import logging
import os
import time
from datetime import datetime

import boto3
from django.utils import timezone

logger = logging.getLogger(__name__)


def _format_items(items):
    lines = []
    for item in items:
        product_name = item.product.name if item.product else "Unknown product"
        line_total = item.unit_price * item.quantity
        lines.append(
            f"- {product_name} | Menge: {item.quantity} | "
            f"Preis: {item.unit_price:.2f} EUR | Summe: {line_total:.2f} EUR"
        )
    return "\n".join(lines)


def send_order_email(order):
    region = os.getenv("AWS_REGION", "eu-central-1")
    sender = os.getenv("SES_FROM_EMAIL")
    sender_list = os.getenv("SES_FROM_EMAILS", "")
    if sender_list:
        senders = [s.strip() for s in sender_list.split(",") if s.strip()]
        if senders:
            sender = senders[0]
    recipient = os.getenv("SES_TO_EMAIL")
    retries = int(os.getenv("SES_SEND_RETRIES", "3"))
    backoff = float(os.getenv("SES_SEND_BACKOFF_SECONDS", "1"))

    if not sender or not recipient:
        logger.warning("SES sender/recipient missing; skipping order email.")
        order.last_email_status = "skipped"
        order.last_email_error = "SES sender/recipient missing"
        order.last_email_attempt_at = timezone.now()
        order.save(
            update_fields=["last_email_status", "last_email_error", "last_email_attempt_at"]
        )
        return

    client_args = {"region_name": region}
    access_key = os.getenv("AWS_ACCESS_KEY_ID")
    secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")
    if access_key and secret_key:
        client_args.update(
            {"aws_access_key_id": access_key, "aws_secret_access_key": secret_key}
        )
    client = boto3.client("ses", **client_args)

    created_at = order.created_at or datetime.utcnow()
    item_lines = _format_items(order.items.all())
    total = order.total

    reply_to = []
    if order.contact_email:
        reply_to = [order.contact_email]

    body = (
        "Neue Bestellung eingegangen\n\n"
        f"Bestellnummer: {order.id}\n"
        f"Datum: {created_at.strftime('%Y-%m-%d %H:%M')}\n"
        f"Kunde: {order.first_name} {order.last_name}\n"
        f"Email: {order.contact_email}\n"
        f"Lieferart: {'Abholung' if order.delivery_type == 'pickup' else 'Lieferung'}\n"
        f"Adresse: {order.street} {order.house_number}, "
        f"{order.postal_code} {order.city}\n\n"
        "Positionen:\n"
        f"{item_lines}\n\n"
        f"Gesamt: {total:.2f} EUR\n"
    )

    for attempt in range(1, retries + 1):
        try:
            subject_extra = f" | От: {order.contact_email}" if order.contact_email else ""
            source = sender
            if order.contact_email:
                source = f"\"{order.contact_email}\" <{sender}>"
            client.send_email(
                Source=source,
                Destination={"ToAddresses": [recipient]},
                ReplyToAddresses=reply_to,
                Message={
                    "Subject": {"Data": f"Neue Bestellung #{order.id}{subject_extra}"},
                    "Body": {"Text": {"Data": body}},
                },
            )
            order.last_email_status = "sent"
            order.last_email_error = ""
            order.last_email_attempt_at = timezone.now()
            order.save(
                update_fields=["last_email_status", "last_email_error", "last_email_attempt_at"]
            )
            return
        except Exception as exc:
            order.last_email_status = "failed"
            order.last_email_error = str(exc)
            order.last_email_attempt_at = timezone.now()
            order.save(
                update_fields=["last_email_status", "last_email_error", "last_email_attempt_at"]
            )
            logger.exception(
                "SES send_email failed (attempt %s/%s) for order %s: %s",
                attempt,
                retries,
                order.id,
                exc,
            )
            if attempt < retries:
                time.sleep(backoff * attempt)
