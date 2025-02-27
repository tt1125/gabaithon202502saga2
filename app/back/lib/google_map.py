import os
import requests
from flask import Blueprint, jsonify, request

    # 各モードの検索範囲 (半径)
modes = {
    "easy mode": 200,
    "normal mode": 450,
    "hard mode": 1000,
}

def generate_routes(current_location_lat, current_location_lng):
    GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
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

    return routes