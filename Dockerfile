# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Install system dependencies for swisseph
RUN apt-get update && apt-get install -y \
    gcc \
    make \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container at /app
COPY backend/requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project into the container
COPY . .

# Expose port 8000
EXPOSE 8000

# Set PYTHONPATH to search both root and backend folder
ENV PYTHONPATH=/app:/app/backend

# Run the application
CMD gunicorn backend.main:app --bind 0.0.0.0:$PORT -k uvicorn.workers.UvicornWorker
