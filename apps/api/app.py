from flask import Flask, jsonify, request
from flask_cors import CORS # type: ignore
import json
from pathlib import Path

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

CONTENT_DIR = Path(__file__).resolve().parents[2] / "content"

@app.get("/api/projects")
def get_projects():
    data = json.loads((CONTENT_DIR / "projects.json").read_text())
    return jsonify(data)

@app.post("/api/contact")
def contact():
    payload = request.get_json(force=True)
    # TODO: validate + rate limit + send email (or store in SQLite)
    # For now: just acknowledge
    return jsonify({"ok": True})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
