FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./

RUN pip install --no-cache-dir --upgrade pip \
    && if [ -s requirements.txt ]; then pip install --no-cache-dir -r requirements.txt; fi \
    && pip install --no-cache-dir gunicorn uvicorn

COPY . .

ENV APP_MODULE=app.main:app \
    GUNICORN_WORKERS=4 \
    GUNICORN_BIND=0.0.0.0:8000

EXPOSE 8000

CMD ["sh", "-c", "gunicorn ${APP_MODULE} -k uvicorn.workers.UvicornWorker --bind ${GUNICORN_BIND} --workers ${GUNICORN_WORKERS}"]
