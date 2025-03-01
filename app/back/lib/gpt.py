import openai
import json
import os
import dotenv


def select_locations(lat, lng, locations: list, prompt: str) -> dict:
    openai.api_key = os.getenv("OPENAI_API_KEY")
    config_message: str = """
    ユーザーから与えれらたユーザーの現在位置と、その周辺にある場所のリストを受け取ります。
    その後、ユーザーに提示されたプロンプトに基づいて、3つのウォーキングの経路を生成します。
    ウォーキングの経路は、現在位置から、point1、point2、point3を通り、最終的に現在位置に戻るように設計されています。
    それぞれの経路は、異なる難易度レベルに基づいて生成されます。
    経路の全体が短い場合はeasy mode、中程度の場合はnormal mode、長い場合はhard modeとして分類されます。
    また、ユーザーのリクエストに基づいて、経路を生成してください。
    リクエストに対応するのが難しい場合は、無理に含めなくても構いません。
    現在位置, point1, point2, point3は、お互いにある程度の距離があり、4点を結んだ経路が丸に近い形になるようにしてください。（重要要件）
    現在地, point1, point2, point3は、全て異なる場所であり、互いにある程度離れている必要があります。
    また、現在地, point1, point2, point3は地図上で反時計回りになるように配置してください。
    easy , normal , hard modeの経路は、それぞれ異なる場所を通るようにしてください。

    【必須条件】 \n 
    {
        "result" : [
            {
                "mode": "easy mode",
                "point1": {
                    "lat": number,
                    "lng": number,
                    "name": string
                },
                "point2": {
                    "lat": number,
                    "lng": number,
                    "name": string
                },
                "point3": {
                    "lat": number,
                    "lng": number,
                    "name": string      
                }
            },
            {
                "mode": "normal mode",
                "point1": {
                    "lat": number,
                    "lng": number,
                    "name": string
                },
                "point2": {
                    "lat": number,
                    "lng": number,
                    "name": string
                },
                "point3": {
                    "lat": number,
                    "lng": number,
                    "name": string      
                }
            },
            {
                "mode": "hard mode",
                "point1": {
                    "lat": number,
                    "lng": number,
                    "name": string
                },
                "point2": {
                    "lat": number,
                    "lng": number,
                    "name": string
                },
                "point3": {
                    "lat": number,
                    "lng": number,
                    "name": string      
                }
            }
        ]
    }
    
    のjson形式で返してください。
    """

    locations_info = ""
    for location in locations:
        locations_info += f"\n\n緯度{location['location']['lat']} 経度{location['location']['lng']} 名称:{location['name']} タイプ:{','.join(location['types']) if isinstance(location.get('types'), list) else location.get('types', '不明')}\n\n"

    user_content: str = (
        f"現在位置：緯度{lat} 経度{lng} \nリクエスト：{prompt}\n周辺の位置情報\n{locations}"
    )

    res = openai.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": config_message},
            {"role": "user", "content": user_content},
        ],
        temperature=0,
        response_format={"type": "json_object"},
    )
    content: dict = res.choices[0].message.content
    print(user_content, content, "😀")
    return json.loads(content)["result"]
