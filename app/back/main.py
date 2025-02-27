from flask import (
    Flask,
    jsonify,
    request,
    send_from_directory,
)
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


class Post(db.Model):
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(db.Integer, primary_key=True)
    title: Mapped[str] = mapped_column(db.String, nullable=False)
    comment: Mapped[str] = mapped_column(db.String, nullable=False)
    embedding: Mapped[list] = mapped_column(db.PickleType, nullable=True)
    created_by: Mapped[str] = mapped_column(db.String, nullable=False)
    created_at: Mapped[float] = mapped_column(db.Double, nullable=False)
    origin_lat: Mapped[float] = mapped_column(db.Double, nullable=False)
    origin_lng: Mapped[float] = mapped_column(db.Double, nullable=False)
    origin_name: Mapped[str] = mapped_column(db.String, nullable=False)
    point1_lat: Mapped[float] = mapped_column(db.Double, nullable=True)
    point1_lng: Mapped[float] = mapped_column(db.Double, nullable=True)
    point1_name: Mapped[str] = mapped_column(db.String, nullable=True)
    point2_lat: Mapped[float] = mapped_column(db.Double, nullable=True)
    point2_lng: Mapped[float] = mapped_column(db.Double, nullable=True)
    point2_name: Mapped[str] = mapped_column(db.String, nullable=True)
    point3_lat: Mapped[float] = mapped_column(db.Double, nullable=True)
    point3_lng: Mapped[float] = mapped_column(db.Double, nullable=True)
    point3_name: Mapped[str] = mapped_column(db.String, nullable=True)


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


@app.route("/api/posts", methods=["POST"])
def post():
    data = request.get_json()
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON format"}), 400

    title = data.get("title")
    comment = data.get("comment")
    embedding = data.get("embedding", [])
    created_by = data.get("created_by")
    created_at = data.get("created_at")
    origin_lat = data.get("origin_lat")
    origin_lng = data.get("origin_lng")
    origin_name = data.get("origin_name")
    point1_lat = data.get("point1_lat")
    point1_lng = data.get("point1_lng")
    point1_name = data.get("point1_name")
    point2_lat = data.get("point2_lat")
    point2_lng = data.get("point2_lng")
    point2_name = data.get("point2_name")
    point3_lat = data.get("point3_lat")
    point3_lng = data.get("point3_lng")
    point3_name = data.get("point3_name")

    if (
        not title
        or not comment
        or not created_by
        or not created_at
        or not origin_lat
        or not origin_lng
        or not origin_name
    ):
        return jsonify({"error": "Required fields are missing"}), 400

    # embedding を適切な形式に変換
    embedding_vector = f"({','.join(map(str, embedding))})"

    new_post = Post(
        title=title,
        comment=comment,
        embedding=embedding_vector,
        created_by=created_by,
        created_at=created_at,
        origin_lat=origin_lat,
        origin_lng=origin_lng,
        origin_name=origin_name,
        point1_lat=point1_lat,
        point1_lng=point1_lng,
        point1_name=point1_name,
        point2_lat=point2_lat,
        point2_lng=point2_lng,
        point2_name=point2_name,
        point3_lat=point3_lat,
        point3_lng=point3_lng,
        point3_name=point3_name,
    )
    db.session.add(new_post)
    db.session.commit()

    return (
        jsonify(
            {"id": new_post.id, "title": new_post.title, "comment": new_post.comment}
        ),
        201,
    )


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
