# FROM python:3.10-slim
 
# ENV PYTHONDONTWRITEBYTECODE=1
# ENV PYTHONUNBUFFERED=1
 
# WORKDIR /code
 
# RUN apt-get update && apt-get install -y \
#     gcc \
#     postgresql-client \
#     netcat-traditional \
#     && rm -rf /var/lib/apt/lists/*
 
# COPY dist/requirements.txt /code/
# RUN pip install --upgrade pip
# RUN pip install -r requirements.txt
 
# COPY . /code/
 
# RUN mkdir -p /code/dist/media /code/dist/static
# RUN chmod -R 777 /code/dist/media /code/dist/static
 
# CMD ["python", "dist/manage.py", "runserver", "0.0.0.0:8000"]

###

# # Backend Dockerfile (Django + Gunicorn)
# FROM python:3.11-slim

# # Prevents Python from writing .pyc files
# ENV PYTHONDONTWRITEBYTECODE=1
# ENV PYTHONUNBUFFERED=1

# # Set working directory
# WORKDIR /app

# # Install dependencies
# COPY dist/requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# # Copy backend source code
# # COPY studentbookbackend/ .
# # do this (correct)
# COPY ./studentbookbackend /app/studentbookbackend
# COPY ./manage.py /app/
# COPY ./requirements.txt /app/

# # Expose Django app port
# EXPOSE 8000

# # Start backend with Gunicorn
# CMD ["gunicorn", "backend_app.wsgi:application", "--bind", "0.0.0.0:8000"]


# Use official Python image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY dist/requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY dist/ /app/

# Run server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
