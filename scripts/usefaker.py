import psycopg2
import psycopg2.extras
import psycopg2.extensions
import os
from dotenv import load_dotenv
from faker import Faker
from datetime import date
from argparse import ArgumentParser


def exec_insertion(connection, tablename: str, **kwargs) -> None:
    COLUMNS = str(tuple(kwargs.keys())).replace("'", "\"")
    VALUES = tuple(kwargs.values())

    with connection.cursor() as cur:
        QUERY = f"INSERT INTO \"{tablename}\" {COLUMNS} VALUES ({("%s," * len(kwargs))[:-1]})"

        print(QUERY)
        cur.execute(QUERY, VALUES)


def exec_query(connection: psycopg2.extensions.connection, query: str) :
    """query 실행 결과를 list[tuple]로 반환합니다."""
    print("query: ", query)
    with connection.cursor() as cur:
        cur.execute(query)
        return cur.fetchall()


def unwrap_or(nullable, then):
    """nullable 예외처리"""
    if not nullable:
        return then
    return nullable


if __name__ == "__main__":
    load_dotenv()
    fake = Faker(["en_US", "ko_KR", "ja_JP", "cs_CZ"])

    parser = ArgumentParser(
        prog="giftogether dummy data generator",
        description="이 프로그램은 더미 데이터를 쉽게, 많이 넣기 위해 만들어졌습니다.",
        epilog="^___________^b",
    )
    parser.add_argument("--table", type=str, help="테이블 이름", required=True)
    parser.add_argument(
        "--number", type=int, help="더미 데이터 개수", required=False, default=1
    )

    args = parser.parse_args()
    ARG_TABLE = args.table
    ARG_NUMBER = args.number

    with psycopg2.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_DEV_USERNAME"),
        password=os.getenv("DB_DEV_PASSWORD"),
        dbname=os.getenv("DB_DEV_DATABASE"),
    ) as conn:

        with conn.cursor() as cursor:
            cursor.execute("SELECT \"userId\" FROM public.user ORDER BY \"userId\" ASC LIMIT 1")
            MIN_USER_ID = int(unwrap_or(cursor.fetchone(), (0,))[0])
            cursor.execute("SELECT \"userId\" from public.user ORDER BY \"userId\" DESC LIMIT 1")
            MAX_USER_ID = int(unwrap_or(cursor.fetchone(), (0,))[0])
            cursor.execute("SELECT \"accId\" from public.account ORDER BY \"accId\" DESC LIMIT 1")
            MAX_ACC_ID = int(unwrap_or(cursor.fetchone(), (0,))[0])
            cursor.execute("SELECT \"imgId\" from public.image ORDER BY \"imgId\" DESC LIMIT 1")
            MAX_IMG_ID = int(unwrap_or(cursor.fetchone(), (0,))[0])
            cursor.execute("SELECT \"fundId\" from public.funding ORDER BY \"fundId\" ASC LIMIT 1")
            MIN_FUND_ID = int(unwrap_or(cursor.fetchone(), (0,))[0])
            cursor.execute("SELECT \"fundId\" from public.funding ORDER BY \"fundId\" DESC LIMIT 1")
            MAX_FUND_ID = int(unwrap_or(cursor.fetchone(), (0,))[0])
            cursor.execute("SELECT \"gratId\" from public.gratitude ORDER BY \"gratId\" DESC LIMIT 1")
            MAX_GRAT_ID = int(unwrap_or(cursor.fetchone(), (0,))[0])
            cursor.execute("SELECT \"gratId\" from public.gratitude ORDER BY \"gratId\" ASC LIMIT 1")
            MIN_GRAT_ID = int(unwrap_or(cursor.fetchone(), (0,))[0])

        print(
            f"""
            MIN_USER_ID: {MIN_USER_ID},
            MAX_USER_ID: {MAX_USER_ID},
            MAX_ACC_ID: {MAX_ACC_ID},
            MAX_IMG_ID: {MAX_IMG_ID},
            MIN_FUND_ID: {MIN_FUND_ID},
            MAX_FUND_ID: {MAX_FUND_ID}"""
        )
        for _ in range(ARG_NUMBER):
            match ARG_TABLE:
                case "account":
                    kwargs = {
                        "bank": fake.word(
                            ext_word_list=[
                                "Kakaobank",
                                "Nonghyup",
                                "Kookmin",
                                "Shinhan",
                                "Woori",
                                "Ibk",
                                "Hana",
                                "Daegu",
                                "Kyongnam",
                                "Gwangju",
                                "Busan",
                                "Jeju",
                                "Deutschebank",
                                "Kdb",
                                "Nfcf",
                                "Kfcc",
                                "Suhyup",
                                "Nacufok",
                                "Citybank",
                                "Tossbank",
                                "Scbank",
                                "Kbank",
                            ]
                        ),
                        "accNum": fake.credit_card_number(),
                    }
                case "address":
                    kwargs = {
                        "userId": fake.random_int(min=MIN_USER_ID, max=MAX_USER_ID),
                        "addrRoad": fake.street_address(),
                        "addrDetl": fake.address(),
                        "addrZip": fake.postcode(),
                        "addrNick": fake.emoji(),
                    }
                case "comment":
                    kwargs = {
                        "fundId": fake.random_int(min=1, max=MAX_FUND_ID),
                        "authorId": fake.random_int(min=1, max=MAX_USER_ID),
                        "content": fake.sentence(),
                    }
                case "donation":
                    kwargs = {
                        "donationStatus": fake.word(ext_word_list=["Donated", "WaitingRefund", "RefundComplete"]),
                        "orderId": fake.word(),
                        "donAmnt": fake.random_int(min=1000, max=100_000_000),
                        "fundId": fake.random_int(min=MIN_FUND_ID, max=MAX_FUND_ID)
                    }
                case "friend":
                    kwargs = {
                        "userId": fake.random_int(min=MIN_USER_ID, max=MAX_USER_ID),
                        "friendId": fake.random_int(min=MIN_USER_ID, max=MAX_USER_ID),
                    }
                case "funding":
                    kwargs = {
                        "fundTitle": fake.paragraph(nb_sentences=1),
                        "fundCont" : fake.paragraph(nb_sentences=2),
                        "fundTheme" : fake.word(ext_word_list=["Birthday", "Anniversary", "Donation"]),
                        "fundGoal" : fake.random_int(min=1000, max=100_000_000),
                        "endAt" : fake.future_date(end_date=date(2055, 3, 29)).strftime("%Y-%m-%d"),
                        "fundUser" : fake.random_int(min=MIN_USER_ID, max=MAX_USER_ID),
                    }
                case "gratitude":
                    # TODO - fundId와 같이 1대1로 물려있음. 만들 때 항상 중복여부를 검사하기 때문에 삽입하기 까다롭다.
                    pass
                case "image":
                    kwargs = {
                        "imgUrl": "https://picsum.photos/200",
                        "imgType": fake.word(
                            ext_word_list=[
                                "Funding",
                                "Donation",
                                "Gratitude",
                                "RollingPaper",
                            ]
                        ),
                        "subId": fake.random_int(min=1, max=100),
                    }
                case "notification":
                    kwargs = {
                        "recvId": fake.random_int(min=1, max=MAX_USER_ID),
                        "sendId": fake.random_int(min=1, max=MAX_USER_ID),
                        "notiType": fake.word(
                            ext_word_list=[
                                "IncomingFollow",
                                "AcceptFollow",
                                "FundClose",
                                "FundAchieve",
                                "NewDonate",
                                "DonatedFundClose",
                                "WriteGratitude",
                                "CheckGratitude",
                            ]
                        ),
                        "reqType": fake.word(
                            ext_word_list=[
                                "00",
                                "01",
                                "02",
                                "03",
                            ]
                        ),
                        "subId": fake.random_int(min=1, max=MAX_FUND_ID), # FIXME - subid description에 맞추기
                    }
                case "open_bank_token":
                    kwargs = {}
                case "rolling_paper":
                    kwargs = {}
                case "user":
                    kwargs = {
                        "userNick": fake.safe_color_name()
                        + " "
                        + fake.first_name()
                        + " "
                        + str(fake.random_int()),
                        "userPw": fake.password(),
                        "userName": fake.name(),
                        "userPhone": fake.phone_number(),
                        "userEmail": fake.email(),
                        "userBirth": fake.date(),
                        "userAcc": None,
                        "userImg": None,
                    }

            exec_insertion(conn, ARG_TABLE, **kwargs)

        conn.commit()
