# ベースイメージを指定
FROM python:3.12-slim

ENV PYTHONUNBUFFERED True
ENV PYTHONPATH /app/back
ENV PORT 5000
ENV APP_HOME /app/back
WORKDIR $APP_HOME

COPY ./app/back/requirements.txt requirements.txt
COPY ./app/back/main.py main.py
COPY ./app/back/lib lib
COPY ./app/front/out /app/front/out

RUN pip install --no-cache-dir -r requirements.txt

CMD if [ "$ENV" = "dev" ]; then \
    python main.py; \
    else \
    exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 main:app; \
    fi