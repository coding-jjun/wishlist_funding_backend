import psycopg2
import psycopg2.extras
import os
from dotenv import load_dotenv
from pprint import pprint
from faker import Faker
from datetime import date
from argparse import ArgumentParser


def exec_insertion(
    connection, tablename: str, **kwargs
) -> None:
    COLUMNS = str(tuple(kwargs.keys())).replace("'", "\"")
    VALUES = tuple(kwargs.values())

    with connection.cursor() as cur:
        QUERY = f"INSERT INTO {tablename} {COLUMNS} VALUES ({("%s," * len(kwargs))[:-1]})"

        print(QUERY)
        cur.execute(QUERY, VALUES)

    connection.commit()


if __name__ == "__main__":
    load_dotenv()
    fake = Faker()

    # parser = ArgumentParser(
    #     prog="giftogether dummy data generator",
    #     description="이 프로그램은 더미 데이터를 쉽게, 많이 넣기 위해 만들어졌습니다.",
    #     epilog="^___________^b",
    # )
    # parser.add_argument("--table", type=str, help="테이블 이름", required=True)
    # parser.add_argument(
    #     "--number", type=int, help="더미 데이터 개수", required=False, default=10
    # )

    # args = parser.parse_args()
    # ARG_TABLE = args.table
    # ARG_NUMBER = args.number


    with psycopg2.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_DEV_USERNAME"),
        password=os.getenv("DB_DEV_PASSWORD"),
        dbname=os.getenv("DB_DEV_DATABASE"),
    ) as conn:
        kwargs = {
            "fundTitle": fake.paragraph(nb_sentences=1),
            "fundCont" : fake.paragraph(nb_sentences=2),
            "fundTheme" : fake.word(ext_word_list=["Birthday", "Anniversary", "Donation"]),
            "fundGoal" : fake.random_int(min=1000, max=100_000_000),
            "endAt" : fake.future_date(end_date=date(2055, 3, 29)).strftime("%Y-%m-%d"),
            "fundUser" : 1
        }
        exec_insertion(conn, "funding", **kwargs)
