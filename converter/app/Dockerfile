FROM python:3-slim-buster

RUN mkdir /code

EXPOSE 9005

WORKDIR /code

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY main.py .

CMD ["uvicorn", "main:app", "--host=0.0.0.0", "--port=9005"]