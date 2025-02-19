from flask import (
    Flask,
    send_from_directory,
)
from flask_cors import CORS
import os
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Mapped, mapped_column

app = Flask(__name__, static_folder="../front/out", static_url_path="")
CORS(app, resources={r"/*": {"origins": "*"}})

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URI")

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


class Test(db.Model):
    __tablename__ = "test"
    id: Mapped[int] = mapped_column(db.Integer, primary_key=True, autoincrement=True)
    message: Mapped[str] = mapped_column(db.String, nullable=False)


@app.route("/")
def index():
    return send_from_directory("../front/out", "index.html")


@app.route("/test")
def test():
    record = Test.query.get(1)
    return {"id": record.id, "message": record.message}, 200


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
