import requests
import os
from concurrent.futures import ThreadPoolExecutor, as_completed


def get_place_name(lat, lng):
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "location": f"{lat},{lng}",
        "radius": 100,  # 半径を小さくして最も近い場所を取得
        "key": os.getenv("GOOGLE_MAPS_API_KEY"),
        "language": "ja",
    }

    response = requests.get(url, params=params)
    data = response.json()

    print(data, "😊")

    if data.get("status") == "OK":
        # 最も近い場所の名前を取得
        if data["results"]:
            name = data["results"][0].get("name")
            return name if name else "無名の場所"
        else:
            return "無名の場所"
    else:
        return "無名の場所"


def get_nearby_places(lat, lng, radius=2000):
    api_key = os.getenv("GOOGLE_MAPS_API_KEY")
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    include_types = [
        "restaurant",
        "cafe",
        "bar",
        "store",
        "museum",
        "park",
        "school",
        "bakery",
        "book_store",
        "city_hall",
        "clothing_store",
        "department_store",
        "library",
    ]

    places = []

    def fetch_places(place_type):
        params = {
            "location": f"{lat},{lng}",
            "radius": radius,
            "type": place_type,
            "key": api_key,
            "language": "ja",
        }
        response = requests.get(url, params=params)
        if response.status_code == 200:
            results = response.json().get("results", [])
            return [
                {
                    "name": place.get("name"),
                    "location": place.get("geometry", {}).get("location"),
                    "type": place_type,
                }
                for place in results
            ]
        else:
            return []

    with ThreadPoolExecutor() as executor:
        future_to_type = {
            executor.submit(fetch_places, place_type): place_type
            for place_type in include_types
        }
        for future in as_completed(future_to_type):
            places.extend(future.result())

    return places


def search_places_by_text(query, lat, lng, radius=2000):
    """
    ユーザーのプロンプトに基づいて、特定の場所を検索します。

    :param query: 検索クエリ（例: "近くのラーメン屋"）
    :param lat: 検索の中心となる緯度
    :param lng: 検索の中心となる経度
    :param radius: 検索範囲の半径（メートル）
    :return: 検索結果のリスト
    """
    api_key = os.getenv("GOOGLE_MAPS_API_KEY")
    url = "https://maps.googleapis.com/maps/api/place/textsearch/json"

    params = {
        "query": query,
        "location": f"{lat},{lng}",
        "radius": radius,
        "key": api_key,
        "language": "ja",  # 日本語で情報を取得
    }

    response = requests.get(url, params=params)
    if response.status_code == 200:
        results = response.json().get("results", [])
        return [
            {
                "name": place.get("name"),
                "location": place.get("geometry", {}).get("location"),
                "types": place.get("types"),
            }
            for place in results
        ]
    else:
        return []


# 使用例
# places = search_places_by_text("近くのラーメン屋", 35.6895, 139.6917)
# print(places)
