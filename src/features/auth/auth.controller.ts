import { Controller, Get, Body, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { KakaoAuthGuard } from './kakao-auth-guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService){}

  @Get('kakao')
  @UseGuards(KakaoAuthGuard)
  async kakaoLogin(){
    return;
  }

  @Get('kakao/callback')
  @UseGuards(KakaoAuthGuard)
  async kakaoCallback(@Req() req: Request, @Res() res:Response){

    const user = req.user as any;
    if(user.type === 'login'){

      res.json({user: user.user})
    

    }else if(user.type === 'once'){
      res.json({user: user.user})
    
    }
    res.end();
  }
    }
  }
}
