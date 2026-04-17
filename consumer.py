from kafka import KafkaConsumer
from random import randint
from base64 import b64decode

counter = randint(1, 1000000)

consumer = KafkaConsumer(
    'audio',
    bootstrap_servers='kafka.cm3202.uk',
    fetch_max_bytes=10485880
)

for msg in consumer:
    with open(f"uploads/recording_{counter}.webm", "wb") as f:
        f.write(b64decode(msg.value))
        counter += 1
        print(f"Written uploads/recording_{counter}.webm")