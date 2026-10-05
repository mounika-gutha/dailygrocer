from flask import Flask, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

DATA_FILE = os.path.join(
    os.path.dirname(__file__),
    "data",
    "products.json"
)


@app.route("/")
def home():
    return jsonify({
        "message": "Grocery Store API is running"
    })
@app.route("/health")
def health():
    return jsonify({
        "status": "healthy"
    }), 200

@app.route("/api/products")
def get_products():
    with open(DATA_FILE, "r") as file:
        products = json.load(file)

    return jsonify(products)
print("REGISTERED ROUTES:")
print(app.url_map)

if __name__ == "__main__":
    app.run(debug=True)
