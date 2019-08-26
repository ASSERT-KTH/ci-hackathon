FROM python:3

COPY  ./src/light_controller /app
COPY requirements.txt /app


WORKDIR /app
RUN pip install -r requirements.txt
ENTRYPOINT ["python"]

EXPOSE 8000


CMD ["server.py"]