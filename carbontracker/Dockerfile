# File: Dockerfile
FROM python:3.13-slim

WORKDIR /app

# Install system dependencies for reportlab and other packages
RUN apt-get update && \
    apt-get install -y \
        git \
        build-essential \
        libfreetype6-dev \
        libjpeg-dev \
        libpng-dev \
        zlib1g-dev \
        libffi-dev && \
    pip install uv && \
    rm -rf /var/lib/apt/lists/*


COPY pyproject.toml ./
COPY src/ ./src/
RUN uv sync

COPY requirements.txt ./
RUN pip install -r requirements.txt

EXPOSE 8000
CMD ["uv", "run", "uvicorn", "fastapi_agent.main:app", "--host", "0.0.0.0", "--port", "8000"]
