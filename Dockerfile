FROM python:3.10-slim

ENV PYTHONUNBUFFERED True

ENV PORT 5000
ENV APP_HOME /
WORKDIR $APP_HOME

COPY ./app/back/requirements.txt /app/back/requirements.txt
COPY ./app/back/main.py /app/back/main.py
COPY ./app/front/out /app/front/out

RUN pip install --no-cache-dir -r /app/back/requirements.txt

CMD if [ "$ENV" = "dev" ]; then python /app/back/main.py; else exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 app.back.main:app; fi