# wishlist_funding_backend

## File naming convention

- 여러 단어일 경우, `-`를 기준으로 구분합니다.
- 동사가 섞인 파일 (ex. `create-user.dto.ts`)일 경우, 동사가 먼저 옵니다.

## How to run this server (test environment)

1. [node.js 설치](https://nodejs.org/en)
2. 의존성 설치 with `npm i`
3. redis server 로컬 설치 [하단 참조](#Install-Redis-Server-Locally)
4. `.env` 설정 [하단 참조](#env-설정)
5. 실행 (watch 모드) with `npm run start:dev`

## .env 설정

```
# NODE
TZ=Asia/Seoul

# NestJS
PORT=

# AWS
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET_NAME=
AWS_S3_REGION=

# Postgres
DB_HOST=
DB_PORT=
# =============[ DEVELOP ]=============
# DB_DEV_DATABASE=
DB_DEV_DATABASE=[각자 테스트하는 DB NAME]
DB_DEV_USERNAME=
DB_DEV_PASSWORD=
# =============[ PRODUCT ]=============
DB_PROD_1_DATABASE=
DB_PROD_1_USERNAME=
DB_PROD_1_PASSWORD=

# Auth
# =============[ KAKAO ]=============
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=
KAKAO_CALLBACK_URI=


# =============[ JWT ]=============
JWT_SECRET=
JWT_REFRESH_SECRET=

# =============[ NAVER ]=============
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
NAVER_CALLBACK_URI=

# =============[ GOOGLE ]=============
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URI=

# local
# KAKAO_CALLBACK_URI=
# NAVER_CALLBACK_URI=
# GOOGLE_CALLBACK_URI=

# Redis
REDIS_HOST=
REDIS_PORT=
# 본인이 설정하고 싶은 레디스 패스워드
REDIS_PASSWORD=
```

## [Install Redis Server Locally]

- 로컬에서만 가능해요!
    - Window → 아래 설치
        
        [Redis-x64-3.0.504.msi](https://prod-files-secure.s3.us-west-2.amazonaws.com/a58622d1-e964-481a-b684-e2f5510530c0/c315cca0-5fbd-4c16-b567-8f5184a44734/Redis-x64-3.0.504.msi)
        
    - https://innovation123.tistory.com/186
    - 로컬에서 테스트 해볼 수 있습니다.
    - MAC → https://wlswoo.tistory.com/44
    - redis 비밀번호 설정 https://peterica.tistory.com/421
    
    ```bash
    # 비밀번호 설정 (개발자 선택사항)
    auth #{PASSWORD}
    >> OK
    
    # key 조회
    keys *
    get #{KEY}
    ```
    

- `CLIENT_ID` , `CLIENT_SECRET` :  SNS 서버에서 발급
- `JWT_SECRET`, `JWT_REFRESH_SECRET` : 임의로 설정한 키
