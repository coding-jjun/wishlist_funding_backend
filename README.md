# wishlist_funding_backend

## File naming convention

- 여러 단어일 경우, `-`를 기준으로 구분합니다.
- 동사가 섞인 파일 (ex. `create-user.dto.ts`)일 경우, 동사가 먼저 옵니다.

### Redis Server 로컬 설치

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
    

- CLIENT_ID , CLIENT_SECRET :  SNS 서버에서 발급
- JWT_SECRET, JWT_REFRESH_SECRET : 임의로 설정한 키
