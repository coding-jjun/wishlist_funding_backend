import axios from 'axios';

export class KakaoApiClient{
  
  private kakaoApiUrl = "https://kapi.kakao.com/v2/user/me";
  private kakaoOauthUrl = "https://kauth.kakao.com/oauth";

  async requestKakaoToken(code: string){
    const params = new URLSearchParams();
    params.append('grant_type', "authorization_code");
    params.append('client_id', process.env.CLIENT_ID);
    params.append('redirect_uri', process.env.REDIRECT_URI);
    params.append('code', code);
    params.append('client_secret', process.env.CLIENT_SECRET);

    try{
      const responseToken = await axios.post(this.kakaoOauthUrl+"/token", params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
      }
      );
      return responseToken.data;
    }catch(error){
      console.log("Error request Kakao Token : ", error);
    }
  }

  async getUserInfo(token: string){
    try{
      const userInfo = await axios.get(this.kakaoApiUrl, {
        headers: {
          'Authorization': 'Bearer ' + token
        }}
      );
      return userInfo.data;
    }catch(error){
      console.log("Error request userInfo from kakao : ", error);

    }
  }
}