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
# (This is now synced to the root)
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project into the container
COPY . .

# Expose port 8000
EXPOSE 8000

# Set PYTHONPATH to search both root and backend folder
ENV PYTHONPATH=/app:/app/backend

# Run the application
# We use 'main:app' which works for both root and /backend/ folder because of PYTHONPATH
CMD gunicorn main:app -p 8000 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
