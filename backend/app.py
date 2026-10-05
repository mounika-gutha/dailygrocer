from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import logging
import time
from prometheus_client import Counter, Histogram, generate_latest

app = Flask(__name__)
CORS(app)

# --------------------------------------------------
# Logging configuration
# --------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s"
)

logger = logging.getLogger(__name__)


# --------------------------------------------------
# Prometheus metrics
# --------------------------------------------------

REQUEST_COUNT = Counter(
    "dailygrocer_requests_total",
    "Total number of HTTP requests",
    ["method", "endpoint", "status"]
)

REQUEST_LATENCY = Histogram(
    "dailygrocer_request_latency_seconds",
    "HTTP request latency in seconds",
    ["method", "endpoint"]
)


# --------------------------------------------------
# Product data file
# --------------------------------------------------

DATA_FILE = os.path.join(
    os.path.dirname(__file__),
    "data",
    "products.json"
)


# --------------------------------------------------
# Request logging
# --------------------------------------------------

@app.before_request
def log_request():
    logger.info(
        "Request: %s %s",
        request.method,
        request.path
    )


# --------------------------------------------------
# Start request timer
# --------------------------------------------------

@app.before_request
def start_timer():
    request.start_time = time.time()


# --------------------------------------------------
# Record request metrics
# --------------------------------------------------

@app.after_request
def record_metrics(response):
    latency = time.time() - request.start_time

    REQUEST_COUNT.labels(
        method=request.method,
        endpoint=request.path,
        status=response.status_code
    ).inc()

    REQUEST_LATENCY.labels(
        method=request.method,
        endpoint=request.path
    ).observe(latency)

    return response


# --------------------------------------------------
# Home endpoint
# --------------------------------------------------

@app.route("/")
def home():
    return jsonify({
        "message": "Grocery Store API is running"
    })


# --------------------------------------------------
# Health endpoint
# --------------------------------------------------

@app.route("/health")
def health():
    return jsonify({
        "status": "healthy"
    }), 200


# --------------------------------------------------
# Products endpoint
# --------------------------------------------------

@app.route("/api/products")
def get_products():
    with open(DATA_FILE, "r") as file:
        products = json.load(file)

    return jsonify(products)


# --------------------------------------------------
# Prometheus metrics endpoint
# --------------------------------------------------

@app.route("/metrics")
def metrics():
    return generate_latest(), 200, {
        "Content-Type": "text/plain; version=0.0.4"
    }


# --------------------------------------------------
# Run application
# --------------------------------------------------

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))

    app.run(
        host="0.0.0.0",
        port=port
    )