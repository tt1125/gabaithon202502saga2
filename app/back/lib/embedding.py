import os
from langchain.embeddings import OpenAIEmbeddings
from langchain.embeddings import HuggingFaceEmbeddings

def get_embedding(text: str, model: str = "openai", api_key: str = None):
    """
    指定した埋め込みモデルを使ってテキストをベクトル化する関数。

    Args:
        text (str): 埋め込みしたいテキスト
        model (str): 使用するモデル ("openai" または "huggingface")
        api_key (str, optional): OpenAI APIキー（"openai" モデル使用時のみ必要）

    Returns:
        list: ベクトル化されたリスト
    """

    
    if model == "openai":
        if api_key:
            os.environ["OPENAI_API_KEY"] = api_key
        embeddings = OpenAIEmbeddings()
    elif model == "huggingface":
        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    else:
        raise ValueError("モデル名は 'openai' または 'huggingface' のどちらかにしてください。")

    return embeddings.embed_query(text)

# テスト実行
if __name__ == "__main__":
    text = "ITエンジニアについて30文字で教えて。"
    
    # OpenAIを使う場合（APIキーが必要）
    api_key = ""
    print("OpenAI Embedding:")
    print(get_embedding(text, model="openai", api_key=api_key))

    # Hugging Faceを使う場合（ローカル実行）
    print("Hugging Face Embedding:")
    print(get_embedding(text, model="huggingface"))