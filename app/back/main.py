from flask import (
    Flask,
    jsonify,
    request,
    send_from_directory,
    request,
    jsonify,
)
from flask_cors import CORS
import os
import requests
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Mapped, mapped_column
from dotenv import load_dotenv

load_dotenv()


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

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")


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
    
    user = Users.query.filter_by(id=json['id']).first()

    if user:
        return jsonify({'is_new_user': True}),200
    else:
        return jsonify({'is_new_user': False}),200

@app.route("/api/suggestion_routes", methods=["POST"])
def get_routes():
    data = request.get_json()
    if (
        not data
        or "current_location_lat" not in data
        or "current_location_lng" not in data
    ):
        return (
            jsonify(
                {
                    "error": "Invalid request, provide current_location_lat and current_location_lng."
                }
            ),
            400,
        )

    current_location_lat, current_location_lng = (
        data["current_location_lat"],
        data["current_location_lng"],
    )

    # 各モードの検索範囲 (半径)
    modes = {
        "easy mode": 200,
        "normal mode": 450,
        "hard mode": 1000,
    }

    def find_extreme_points(current_location_lat, current_location_lng, radius):
        """指定の範囲内で、東西南北方向の最も遠い3地点を取得する"""
        url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
        params = {
            "location": f"{current_location_lat},{current_location_lng}",
            "radius": radius,
            "key": GOOGLE_MAPS_API_KEY,
        }
        response = requests.get(url, params=params)
        results = response.json().get("results", [])

        print(f"取得した地点数: {len(results)}")

        if len(results) < 4:
            print("十分な地点が取得できませんでした")
            return []

        # 除外対象の types (市町村などの行政区分)
        exclude_types = {
            "locality",
            "sublocality",
            "administrative_area_level_1",
            "administrative_area_level_2",
            "administrative_area_level_3",
        }

        # 東西南北方向の最も遠い4地点を探す
        directions = {"north": None, "south": None, "east": None, "west": None}

        for place in results:
            place_lat = place["geometry"]["location"]["lat"]
            place_lng = place["geometry"]["location"]["lng"]
            name = place.get("name", "Unknown")
            place_types = set(place.get("types", []))

            # 市や町などの行政区分を除外
            if place_types & exclude_types:
                print(f"除外: {name} ({place_types})")
                continue

            if place_lat > current_location_lat and (
                not directions["north"] or place_lat > directions["north"]["lat"]
            ):
                directions["north"] = {"lat": place_lat, "lng": place_lng, "name": name}
            if place_lat < current_location_lat and (
                not directions["south"] or place_lat < directions["south"]["lat"]
            ):
                directions["south"] = {"lat": place_lat, "lng": place_lng, "name": name}
            if place_lng > current_location_lng and (
                not directions["east"] or place_lng > directions["east"]["lng"]
            ):
                directions["east"] = {"lat": place_lat, "lng": place_lng, "name": name}
            if place_lng < current_location_lng and (
                not directions["west"] or place_lng < directions["west"]["lng"]
            ):
                directions["west"] = {"lat": place_lat, "lng": place_lng, "name": name}

        # 4方向の中から最も遠い3地点を選択
        valid_points = [p for p in directions.values() if p is not None]

        if len(valid_points) < 3:
            additional_points = sorted(
                results,
                key=lambda p: (
                    (p["geometry"]["location"]["lat"] - current_location_lat) ** 2
                    + (p["geometry"]["location"]["lng"] - current_location_lng) ** 2
                ),
                reverse=True,
            )

            # 行政区分を含むものをフィルタリング
            additional_points = [
                {
                    "lat": p["geometry"]["location"]["lat"],
                    "lng": p["geometry"]["location"]["lng"],
                    "name": p["name"],
                }
                for p in additional_points
                if not (set(p.get("types", [])) & exclude_types)
            ]

            return additional_points[:3]

        valid_points.sort(
            key=lambda p: (
                (p["lat"] - current_location_lat) ** 2
                + (p["lng"] - current_location_lng) ** 2
            ),
            reverse=True,
        )

        return valid_points[:3]

    routes = []
    for mode, radius in modes.items():
        points = find_extreme_points(current_location_lat, current_location_lng, radius)
        print(f"{mode}: {points}", "========")
        if len(points) == 3:
            routes.append(
                {
                    "mode": mode,
                    "point1": points[0],
                    "point2": points[1],
                    "point3": points[2],
                }
            )

    return jsonify(routes)


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
