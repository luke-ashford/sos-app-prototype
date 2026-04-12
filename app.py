from flask import Flask, render_template, request
from random import randint

app = Flask(__name__)
counter = randint(1, 1000000)


@app.route('/')
def hello_world():
    return render_template('index.html')


@app.route('/sos', methods=['POST'])
def sos():
    print(request.get_json())
    return ("", 204)

@app.route('/audio', methods=['POST'])
def audio():
    global counter
    raw_data = request.data  # binary audio

    with open(f"uploads/recording_{counter}.webm", "wb") as f:
        f.write(raw_data)
        counter += 1

    return ("", 204)


if __name__ == '__main__':
    app.run()

# TODO: Setup Kafka