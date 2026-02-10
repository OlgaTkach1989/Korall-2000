FROM python:3.13-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY backend/ /app

EXPOSE 8000

RUN sed -i 's/\r$//' /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["sh", "/app/entrypoint.sh"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
