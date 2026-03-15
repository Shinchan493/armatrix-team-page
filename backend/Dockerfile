# ---- Build stage ----
FROM python:3.11-slim AS builder

WORKDIR /app

# Install dependencies into a prefix so they can be copied cleanly
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt


# ---- Runtime stage ----
FROM python:3.11-slim

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /install /usr/local

# Copy application source
COPY main.py models.py database.py routes.py ./

# Render injects $PORT at runtime (defaults to 10000 locally)
ENV PORT=10000

EXPOSE ${PORT}

# Use shell form so $PORT is expanded at container startup
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT}
