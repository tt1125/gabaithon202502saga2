from flask import Flask, send_from_directory
from flask_cors import CORS
import os
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Mapped, mapped_column
from pgvector.sqlalchemy import Vector
from sqlalchemy import select
from sqlalchemy.sql import func

from lib.hello_world import hello_world

app = Flask(__name__, static_folder="../front/out", static_url_path="")
CORS(app, resources={r"/*": {"origins": "*"}})

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URI")

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


class Test(db.Model):
    __tablename__ = "test"
    id: Mapped[int] = mapped_column(db.Integer, primary_key=True, autoincrement=True)
    message: Mapped[str] = mapped_column(db.String, nullable=False)


class TestVector(db.Model):
    __tablename__ = "test_vector"
    id: Mapped[str] = mapped_column(db.String, primary_key=True)
    content: Mapped[str] = mapped_column(db.String, nullable=False)
    embedding: Mapped[Vector] = mapped_column(Vector(10))


@app.route("/")
def index():
    return send_from_directory("../front/out", "index.html")


@app.route("/test")
def test():
    record = Test.query.get(1)
    return {"id": record.id, "message": record.message}, 200


@app.route("/hello_world")
def hello_world_test():
    return hello_world()


@app.route("/search_test")
def search_test():
    max_distance = 100
    actual_distance = func.cast(TestVector.embedding, Vector(10)).l2_distance(
        [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
    )

    vector_search_score = (1 - actual_distance / max_distance).label(
        "vector_search_score"
    )
    vector_search_score = func.greatest(vector_search_score, 0)

    results = db.session.execute(
        select(TestVector, vector_search_score, actual_distance.label("distance"))
        .order_by(vector_search_score.desc())
        .limit(3)
    ).all()

    print(results)

    formatted_results = [
        {
            "id": result.TestVector.id,
            "content": result.TestVector.content,
            "embedding": result.TestVector.embedding.tolist(),
            "score": float(result[1]),
            "distance": float(result[2]),
        }
        for result in results
    ]

    return {"results": formatted_results}, 200


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
