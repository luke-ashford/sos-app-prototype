from kafka import KafkaConsumer
from random import randint

counter = randint(1, 1000000)

consumer = KafkaConsumer(
    'audio',
    bootstrap_servers='kafka.cm3202.uk'
)

for msg in consumer:
    print(msg)
    #with open(f"uploads/recording_{counter}.webm", "wb") as f:
    #    f.write(msg)
    #    counter += 1