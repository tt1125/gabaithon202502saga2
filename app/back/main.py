from flask import (
    Flask,
    send_from_directory,
)

from flask_cors import CORS

app = Flask(__name__, static_folder="../front/out", static_url_path="")
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/")
def index():
    return send_from_directory("../front/out", "index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)


app = Flask(__name__)
