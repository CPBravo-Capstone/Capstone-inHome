# Use official Python image as base
FROM python:3.11-slim AS backend

# Install system dependencies
RUN apt-get update && apt-get install -y libpq-dev gcc postgresql-client

# Set environment variables for Python
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory for backend
WORKDIR /backend

# Copy backend application files
COPY ./requirements.txt ./

# Install backend dependencies
RUN pip install -r requirements.txt

# Copy backend application files
COPY . .

# expose port 8000
EXPOSE 8000

# Run the backend application using Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "inHome_proj.wsgi.application"]
