import os
import requests
from flask import Blueprint, jsonify, request


def generate_routes(current_location_lat, current_location_lng):
    GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
    
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "location": f"{current_location_lat},{current_location_lng}",
        "radius": 1000,
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
        "political"
    }

    filtered_results = [
        {
            "lat": place["geometry"]["location"]["lat"],
            "lng": place["geometry"]["location"]["lng"],
            "name": place.get("name", "Unknown"),
            "types": place.get("types", [])  # typesを追加
        }
        for place in results
        if not set(place.get("types", [])) & exclude_types
        ]

    print(f"フィルタ後の地点数: {len(filtered_results)}")
    print(filtered_results)

    return filtered_results
