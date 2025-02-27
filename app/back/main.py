from flask import Flask, send_from_directory
from flask_cors import CORS
import os
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Mapped, mapped_column
from pgvector.sqlalchemy import Vector
from sqlalchemy import select
from sqlalchemy.sql import func

from lib.hello_world import hello_world

from flask import request, jsonify #よく分からんけど，ちょっと追加してみた．
from sqlalchemy.exc import IntegrityError

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
    id: Mapped[int] = mapped_column(db.Integer, primary_key=True, autoincrement=True)
    content: Mapped[str] = mapped_column(db.String, nullable=False)
    embedding: Mapped[Vector] = mapped_column(Vector(10))

class Posts(db.Model):
    __tablename__ = "posts"
    id: Mapped[int] = mapped_column(db.Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(db.String,nullable=True)
    comment: Mapped[str] = mapped_column(db.String,nullable=True)
    embedding: Mapped[Vector] = mapped_column(Vector(1536))
    created_by: Mapped[str] = mapped_column(db.String,nullable=True)
    created_at: Mapped[float] = mapped_column(db.Float,nullable=True)
    origin_lat: Mapped[float] = mapped_column(db.Float,nullable=True)
    origin_lng: Mapped[float] = mapped_column(db.Float,nullable=True)
    origin_name: Mapped[str] = mapped_column(db.String,nullable=True)
    point1_lat: Mapped[float] = mapped_column(db.Float,nullable=True)
    point1_lng: Mapped[float] = mapped_column(db.Float,nullable=True)
    point1_name: Mapped[str] = mapped_column(db.String,nullable=True)
    point2_lat: Mapped[float] = mapped_column(db.Float,nullable=True)
    point2_lng: Mapped[float] = mapped_column(db.Float,nullable=True)
    point2_name: Mapped[str] = mapped_column(db.String,nullable=True)
    point3_lat: Mapped[float] = mapped_column(db.Float,nullable=True)
    point3_lng: Mapped[float] = mapped_column(db.Float,nullable=True)
    point3_name: Mapped[str] = mapped_column(db.String,nullable=True)

class Users(db.Model):
    __tablename__ = "users"
    id: Mapped[str] = mapped_column(db.String, primary_key=True)
    name: Mapped[str] = mapped_column(db.String,nullable=True)
    img_url: Mapped[str] = mapped_column(db.String,nullable=True)


@app.route("/")
def index():
    return send_from_directory("../front/out", "index.html")


@app.route("/test")
def test():
    record = Test.query.get(1)
    return {"id": record.id, "message": record.message}, 200

@app.route("/user",methods=['POST'])
def insert_userJSON():

    json = request.get_json()

    if not json or 'id' not in json or 'img_url' not in json or 'name' not in json:
        return jsonify({'error': 'Invalid!'}), 400
    new_user = Users(img_url=json['img_url'],name=json['name'])

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'Add success!'}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'ID Conflict!'}),409
    except Exception as eX:
        db.session.rollback()
        return jsonify({'error': str(eX)}), 500

@app.route("/check_newcomer",methods=['POST'])
def check_newcomer():
    json = request.get_json()

    if not json or 'id' not in json:
        return jsonify({'error': 'Invalid!'}),400
    
    user = Users.query.filter_by(id=json['id'].first())

    if user:
        return jsonify({'is_new_user': True}),200
    else:
        return jsonify({'is_new_user': False}),200




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
