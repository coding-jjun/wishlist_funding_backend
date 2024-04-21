import psycopg2
import psycopg2.extras
import os
from dotenv import load_dotenv
from pprint import pprint

load_dotenv()

conn = psycopg2.connect(
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_DEV_USERNAME"),
    password=os.getenv("DB_DEV_PASSWORD"),
    dbname=os.getenv("DB_DEV_DATABASE"),
)

with conn:
    with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
        cur.execute("SELECT * FROM Funding;")
        for row in cur.fetchall():
            pprint(row)
