import requests
import os


def get_place_name(lat, lng):
    url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {"latlng": f"{lat},{lng}", "key": os.getenv("GOOGLE_MAPS_API_KEY")}

    response = requests.get(url, params=params)
    data = response.json()

    if data.get("status") == "OK":
        # 最初の候補の建物名を取得
        for result in data["results"]:
            if "establishment" in result["types"]:  # 建物情報を含むかチェック
                return result["formatted_address"]
        return data["results"][0]["formatted_address"]  # 一般的な住所情報を返す
    else:
        return None
