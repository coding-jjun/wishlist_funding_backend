import psycopg2
import psycopg2.extras
import os
from dotenv import load_dotenv
from pprint import pprint
from faker import Faker
from datetime import date

load_dotenv()
fake = Faker()


with psycopg2.connect(
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_DEV_USERNAME"),
    password=os.getenv("DB_DEV_PASSWORD"),
    dbname=os.getenv("DB_DEV_DATABASE"),
) as conn:
    with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
        # postgresql은 double quote `"`를 붙여주지 않으면 기본으로 소문자화 된다.
        QUERY = """
            INSERT INTO funding ("fundTitle", "fundCont", "fundTheme", "fundGoal", "endAt", "fundUser")
            VALUES (%s, %s, %s, %s, %s, %s);"""

        fund_title = fake.paragraph(nb_sentences=1)
        fund_cont = fake.paragraph(nb_sentences=2)
        fund_theme = fake.word(ext_word_list=["Birthday", "Anniversary", "Donation"])
        fund_goal = fake.random_int(min=1000, max=100_000_000)
        end_at = fake.future_date(end_date=date(2055, 3, 29)).strftime("%Y-%m-%d")
        fund_user = 1

        cur.execute(
            QUERY, (fund_title, fund_cont, fund_theme, fund_goal, end_at, fund_user)
        )
        conn.commit()

    with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
        QUERY = "SELECT * FROM funding;"

        cur.execute(QUERY)

        for data in cur.fetchall():
            pprint(data)
