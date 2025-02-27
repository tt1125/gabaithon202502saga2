import os
from langchain_community.embeddings import OpenAIEmbeddings
from dotenv import load_dotenv

# .env ファイルを読み込む
load_dotenv()

# OpenAI APIキーを環境変数から取得
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise ValueError("OpenAI APIキーが設定されていません。'.env' ファイルに 'OPENAI_API_KEY' を設定してください。")

# OpenAI Embeddings のインスタンスを作成
embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)

def get_embedding(text: str):
    """
    OpenAIの埋め込みモデルを使ってテキストをベクトル化する関数。

    Args:
        text (str): 埋め込みしたいテキスト

    Returns:
        list: ベクトル化されたリスト
    """
    return embeddings.embed_query(text)

# テスト実行
if __name__ == "__main__":
    text = "ITエンジニアについて30文字で教えて。"

    # OpenAI埋め込みの結果を表示
    print("OpenAI Embedding:")
    # print(get_embedding(text))
    print(len(get_embedding(text)))
