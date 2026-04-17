from flask import Flask, render_template, request
from kafka import KafkaProducer
from base64 import b64encode

app = Flask(__name__)
producer = KafkaProducer(bootstrap_servers='kafka.cm3202.uk', max_request_size=10485880)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/sos', methods=['POST'])
def sos():
    print(request.get_json())
    return ("", 204)

@app.route('/audio', methods=['POST'])
def audio():
    raw_data = request.data
    encoded = b64encode(raw_data) # binary audio

    future = producer.send('audio', value=encoded, headers=[('content-encoding', b'base64')])
    future.get()

    return ("", 204)


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)