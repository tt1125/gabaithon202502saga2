from flask import Flask, send_from_directory
from flask_cors import CORS
import os
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Mapped, mapped_column
from pgvector.sqlalchemy import Vector
from sqlalchemy import select
from sqlalchemy.sql import func
from flask import request, jsonify
from lib.embedding import get_embedding
from sqlalchemy import TIMESTAMP

# from lib.hello_world import hello_world

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

# postsテーブルの定義
class Post(db.Model):
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(db.Integer, primary_key=True, autoincrement=True)  # 自動生成
    title: Mapped[str] = mapped_column(db.String, nullable=False)
    comment: Mapped[str] = mapped_column(db.String, nullable=False)
    embedding: Mapped[list] = mapped_column(Vector(1536), nullable=False)  # 1536次元のベクトル
    created_by: Mapped[str] = mapped_column(db.String, nullable=False)
    created_at: Mapped[float] = mapped_column(TIMESTAMP, nullable=False)
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


# @app.route("/hello_world")
# def hello_world_test():
#     return hello_world()


@app.route("/api/posts", methods=["POST"])
def create_post():
    """新しい投稿をデータベースに格納するエンドポイント"""

    # JSON データを取得
    data = request.get_json()

    # 必須フィールドのバリデーション
    required_fields = [
        "title", "comment", "created_by", "created_at",
        "origin_lat", "origin_lng", "origin_name"
    ]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400

    # 📌 エンべディング用のテキストを作成
    embedding_text = f"""
    Title: {data['title']}
    Comment: {data['comment']}
    Origin: {data['origin_name']}
    Stops: {', '.join(filter(None, [
        data.get('point1_name'),
        data.get('point2_name'),
        data.get('point3_name')
    ]))}
    """.strip()

    # 📌 エンべディングを取得
    embedding_vector = get_embedding(embedding_text)

    # 新しい `Post` インスタンスを作成
    new_post = Post(
        title=data["title"],
        comment=data["comment"],
        embedding=embedding_vector,  # ここにエンべディングを格納
        created_by=data["created_by"],
        created_at=data["created_at"],
        origin_lat=data["origin_lat"],
        origin_lng=data["origin_lng"],
        origin_name=data["origin_name"],
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
    actual_distance = Post.embedding.l2_distance(query_embedding)

    # スコア = 1 - (distance / max_distance) を計算し、負の場合は 0 とする
    vector_search_score = (1 - actual_distance / max_distance).label("vector_search_score")
    vector_search_score = func.greatest(vector_search_score, 0)

    # 類似度スコアが高い順に３件取得
    stmt = (
        select(Post, vector_search_score, actual_distance.label("distance"))
        .order_by(vector_search_score.desc())
        .limit(3)
    )
    results = db.session.execute(stmt).all()

    # 結果を整形してレスポンスに
    formatted_results = [
        {
            "title": result.Post.title,
            "comment": result.Post.comment,
            "created_by": result.Post.created_by,
            "created_at": result.Post.created_at,
            "origin_lat": result.Post.origin_lat,
            "origin_lng": result.Post.origin_lng,
            "origin_name": result.Post.origin_name,
            "point1_lat": result.Post.point1_lat,
            "point1_lng": result.Post.point1_lng,
            "point1_name": result.Post.point1_name,
            "point2_lat": result.Post.point2_lat,
            "point2_lng": result.Post.point2_lng,
            "point2_name": result.Post.point2_name,
            "point3_lat": result.Post.point3_lat,
            "point3_lng": result.Post.point3_lng,
            "point3_name": result.Post.point3_name,
            "score": float(result[1]),
            "distance": float(result[2]),
        }
        for result in results
    ]

    return jsonify(formatted_results), 200


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
