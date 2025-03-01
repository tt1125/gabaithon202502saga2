from flask import (
    Flask,
    jsonify,
    request,
    send_from_directory,
    request,
    jsonify,
    redirect,
)
from flask_cors import CORS
import os
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Mapped, mapped_column
from dotenv import load_dotenv

from lib.gpt import select_locations
from lib.places import get_nearby_places, get_place_name, search_places_by_text
from lib.embedding import get_embedding
from flask import Response
import json

load_dotenv()


from pgvector.sqlalchemy import Vector
from sqlalchemy import select
from sqlalchemy.sql import func

from flask import request, jsonify  # よく分からんけど，ちょっと追加してみた．
from sqlalchemy.exc import IntegrityError
from datetime import datetime
import numpy as np
import datetime
from datetime import datetime, timezone, timedelta

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
    title: Mapped[str] = mapped_column(db.String, nullable=False)
    comment: Mapped[str] = mapped_column(db.String, nullable=False)
    embedding: Mapped[Vector] = mapped_column(Vector(1536))
    created_by: Mapped[str] = mapped_column(db.String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(db.DateTime, nullable=False)
    origin_lat: Mapped[float] = mapped_column(db.Float, nullable=False)
    origin_lng: Mapped[float] = mapped_column(db.Float, nullable=False)
    origin_name: Mapped[str] = mapped_column(db.String, nullable=False)
    point1_lat: Mapped[float] = mapped_column(db.Float, nullable=False)
    point1_lng: Mapped[float] = mapped_column(db.Float, nullable=False)
    point1_name: Mapped[str] = mapped_column(db.String, nullable=False)
    point2_lat: Mapped[float] = mapped_column(db.Float, nullable=False)
    point2_lng: Mapped[float] = mapped_column(db.Float, nullable=False)
    point2_name: Mapped[str] = mapped_column(db.String, nullable=False)
    point3_lat: Mapped[float] = mapped_column(db.Float, nullable=False)
    point3_lng: Mapped[float] = mapped_column(db.Float, nullable=False)
    point3_name: Mapped[str] = mapped_column(db.String, nullable=False)


class Users(db.Model):
    __tablename__ = "users"
    id: Mapped[str] = mapped_column(db.String, primary_key=True)
    name: Mapped[str] = mapped_column(db.String, nullable=False)
    img_url: Mapped[str] = mapped_column(db.String, nullable=False)
    gender: Mapped[str] = mapped_column(db.String, nullable=False)
    age: Mapped[int] = mapped_column(db.Integer, nullable=False)


class Comments(db.Model):
    __tablename__ = "comments"
    id: Mapped[int] = mapped_column(db.Integer, primary_key=True, autoincrement=True)
    post_id: Mapped[int] = mapped_column(db.Integer, nullable=False)
    thread_id: Mapped[int] = mapped_column(db.Integer, nullable=False)
    comment: Mapped[str] = mapped_column(db.String, nullable=False)
    user_id: Mapped[str] = mapped_column(db.String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(db.DateTime, nullable=False)


@app.route("/")
def index():
    return send_from_directory("../front/out", "index.html")


@app.errorhandler(404)
def not_found(e):
    return redirect("/")


@app.route("/user", methods=["POST"])
def insert_userJSON():

    json = request.get_json()
    print("Received JSON:", json)  # デバッグ用

    if (
        not json
        or "id" not in json
        or "img_url" not in json
        or "name" not in json
        or "gender" not in json
        or "age" not in json
    ):
        return jsonify({"error": "Invalid!"}), 400
    new_user = Users(
        id=json["id"],
        img_url=json["img_url"],
        name=json["name"],
        gender=json["gender"],
        age=json["age"],
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "Add success!"}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "ID Conflict!"}), 409
    except Exception as eX:
        db.session.rollback()
        return jsonify({"error": str(eX)}), 501


@app.route("/check_newcomer", methods=["POST"])
def check_newcomer():
    json = request.get_json()
    if not json or "id" not in json:
        return jsonify({"error": "Invalid!"}), 400

    user = Users.query.filter_by(id=json["id"]).first()

    if user:
        return jsonify({"is_new_user": True}), 200
    else:
        return jsonify({"is_new_user": False}), 200


@app.route("/get_recent_posts", methods=["POST"])
def get_recent_posts():
    json = request.get_json()

    if not json or "offset" not in json:
        return jsonify({"error": "Invalid!"}), 400
    offset = json["offset"]
    posts = Posts.query.order_by(Posts.created_at.desc()).offset(offset).limit(8).all()
    posts_list = []

    for post in posts:
        post_user = Users.query.filter_by(id=post.created_by).first()
        if post_user is None:
            continue  # ユーザーが見つからない場合はスキップ

        posts_list.append(
            {
                "id": post.id,
                "title": post.title,
                "comment": post.comment,
                "created_by": post.created_by,
                "created_at": post.created_at,
                "name": post_user.name,
                "img_url": post_user.img_url,
                "gender": post_user.gender,
                "age": post_user.age,
                "origin_lat": post.origin_lat,
                "origin_lng": post.origin_lng,
                "origin_name": post.origin_name,
                "point1_lat": post.point1_lat,
                "point1_lng": post.point1_lng,
                "point1_name": post.point1_name,
                "point2_lat": post.point2_lat,
                "point2_lng": post.point2_lng,
                "point2_name": post.point2_name,
                "point3_lat": post.point3_lat,
                "point3_lng": post.point3_lng,
                "point3_name": post.point3_name,
            }
        )

        posts_list = np.array(posts_list).tolist()

    return jsonify({"result": posts_list}), 200


@app.route("/post_comment", methods=["POST"])
def post_comment():
    json = request.get_json()

    if (
        not json
        or "post_id" not in json
        or "user_id" not in json
        or "comment" not in json
    ):
        return jsonify({"error": "Invalid!"}), 400

    searchNum = 0
    while True:
        # スレッド順にコメントを探索する．
        tmp = Comments.query.filter_by(
            thread_id=searchNum, post_id=json["post_id"]
        ).first()
        if not tmp:
            break
        else:
            searchNum += 1

    # 日本標準時 (JST) のタイムゾーンを定義
    jst_timezone = timezone(timedelta(hours=9))

    # 現在の日本時間を取得
    current_jst_time = datetime.now(jst_timezone)

    new_comment = Comments(
        created_at=current_jst_time,
        thread_id=searchNum,
        post_id=json["post_id"],
        user_id=json["user_id"],
        comment=json["comment"],
    )

    try:
        db.session.add(new_comment)
        db.session.commit()
        return jsonify({"message": "Add success!"}), 201
    except IntegrityError:  # IDは自動で割り振られるから，衝突するわけない．
        db.session.rollback()
        return jsonify({"error": "ID Conflict!"}), 409
    except Exception as eX:
        db.session.rollback()
        return jsonify({"error": str(eX)}), 501


@app.route("/get_comment", methods=["POST"])
def get_comment():
    json = request.get_json()
    if not json or "post_id" not in json:
        return jsonify({"error": "Invalid!"}), 400

    comments = (
        db.session.query(
            Comments, Users.name, Users.img_url
        )  # Users の name, img_url を取得
        .join(Users, Comments.user_id == Users.id)  # Users テーブルと JOIN
        .filter(Comments.post_id == json["post_id"])
        .order_by(Comments.created_at.desc())
        .all()
    )

    comments_list = []
    for comment, user_name, user_img_url in comments:
        comments_list.append(
            {
                "comment": comment.comment,
                "user_id": comment.user_id,
                "user_name": user_name,  # 追加
                "user_img_url": user_img_url,  # 追加
                "created_at": comment.created_at,
                "thread_id": comment.thread_id,
            }
        )

    return jsonify({"result": comments_list}), 200


@app.route("/api/suggestion_routes", methods=["POST"])
def get_routes():
    data = request.get_json()
    if (
        not data
        or "current_location_lat" not in data
        or "current_location_lng" not in data
        or "prompt" not in data
    ):
        return (
            jsonify(
                {
                    "error": "Invalid request, provide current_location_lat and current_location_lng."
                }
            ),
            400,
        )

    current_location_lat, current_location_lng, prompt = (
        data["current_location_lat"],
        data["current_location_lng"],
        data["prompt"],
    )

    places = get_nearby_places(current_location_lat, current_location_lng, 1000)
    request_places = search_places_by_text(
        prompt, current_location_lat, current_location_lng, 1000
    )
    total_places = places + request_places
    routes = select_locations(
        current_location_lat, current_location_lng, total_places, prompt
    )

    return Response(json.dumps(routes, ensure_ascii=False), mimetype="application/json")


@app.route("/api/posts", methods=["POST"])
def create_post():
    try:
        """新しい投稿をデータベースに格納するエンドポイント"""
        # JSON データを取得
        print("Request JSON:", request.get_json())
        data = request.get_json()
        # 必須フィールドのバリデーション
        # :画鋲: エンべディング用のテキストを作成
        origin_name = get_place_name(data["origin_lat"], data["origin_lng"])
        print(f"Origin: {origin_name}", "😀")
        embedding_text = f"""
        Title: {data['title']}
        Comment: {data['comment']}
        Origin: {origin_name}
        Stops: {', '.join(filter(None, [
            data.get('point1_name'),
            data.get('point2_name'),
            data.get('point3_name')
        ]))}
        """.strip()
        # :画鋲: エンべディングを取得
        embedding_vector = get_embedding(embedding_text)
        # 新しい `Post` インスタンスを作成

        jst_timezone = timezone(timedelta(hours=9))

        # 現在の日本時間を取得
        current_jst_time = datetime.now(jst_timezone)
        new_post = Posts(
            title=data["title"],
            comment=data["comment"],
            embedding=embedding_vector,  # ここにエンべディングを格納
            created_by=data["created_by"],
            created_at=current_jst_time,
            origin_lat=data["origin_lat"],
            origin_lng=data["origin_lng"],
            origin_name=origin_name,
            point1_lat=data.get("point1_lat"),
            point1_lng=data.get("point1_lng"),
            point1_name=data.get("point1_name"),
            point2_lat=data.get("point2_lat"),
            point2_lng=data.get("point2_lng"),
            point2_name=data.get("point2_name"),
            point3_lat=data.get("point3_lat"),
            point3_lng=data.get("point3_lng"),
            point3_name=data.get("point3_name"),
        )
        # データベースに保存
        db.session.add(new_post)
        db.session.commit()
        return jsonify({"message": "Post created successfully", "id": new_post.id}), 201
    except Exception as e:
        import traceback

        error_message = traceback.format_exc()
        print(error_message)
        return jsonify({"error": str(e)}), 500


@app.route("/api/search", methods=["POST"])
def search_posts():
    data = request.get_json()
    if not data or "query" not in data:
        return jsonify({"error": "Missing query parameter"}), 400
    # ユーザー入力テキストをエンべディング化
    query_text = data["query"]
    query_embedding = get_embedding(query_text)
    # 検索時のパラメータ（max_distance はスケール調整用）
    max_distance = 100
    # Post.embedding は Vector(1536) 型なので、get_embedding() で取得したベクトルと L2 距離を計算
    actual_distance = Posts.embedding.l2_distance(query_embedding)
    # スコア = 1 - (distance / max_distance) を計算し、負の場合は 0 とする
    vector_search_score = (1 - actual_distance / max_distance).label(
        "vector_search_score"
    )
    vector_search_score = func.greatest(vector_search_score, 0)
    # 類似度スコアが高い順に３件取得
    stmt = (
        select(
            Posts,
            Users.name,
            Users.img_url,
            vector_search_score,
            actual_distance.label("distance"),
        )
        .join(Users, Posts.created_by == Users.id)  # UsersテーブルをPostsと結合
        .order_by(vector_search_score.desc())
        .limit(3)
    )
    results = db.session.execute(stmt).all()
    # 結果を整形してレスポンスに
    formatted_results = [
        {
            "id": result.Posts.id,
            "title": result.Posts.title,
            "comment": result.Posts.comment,
            "created_by": result.Posts.created_by,
            "created_at": result.Posts.created_at,
            "name": result.name,  # Usersテーブルから取得したname
            "img_url": result.img_url,  # Usersテーブルから取得したimg_url
            "origin_lat": result.Posts.origin_lat,
            "origin_lng": result.Posts.origin_lng,
            "origin_name": result.Posts.origin_name,
            "point1_lat": result.Posts.point1_lat,
            "point1_lng": result.Posts.point1_lng,
            "point1_name": result.Posts.point1_name,
            "point2_lat": result.Posts.point2_lat,
            "point2_lng": result.Posts.point2_lng,
            "point2_name": result.Posts.point2_name,
            "point3_lat": result.Posts.point3_lat,
            "point3_lng": result.Posts.point3_lng,
            "point3_name": result.Posts.point3_name,
            "score": float(result[3]),
            "distance": float(result[4]),
        }
        for result in results
    ]
    return jsonify(formatted_results), 200


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
