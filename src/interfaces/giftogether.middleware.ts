import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class GiftogetherMiddleware implements NestMiddleware {
  private readonly logger = new Logger();

  use(req: any, res: any, next: () => void) {
    const logHeader    = `================== [${req.method}] ${req.url} ==================`;
    const logDate      = `date     : ${new Date()}`;
    const logAgent     = `agent    : ${req.headers['user-agent']}`;
    const logClientIp  = `client Ip: ${req.ip}`;
    const reqBody = {...req.body};

    const keys = Object.keys(reqBody)
    var params = "";

    if(keys.length !== 0){
      params = "================== [ Parameters ] ==================\n";

      keys.forEach((key) => {
        const value = reqBody[key];
        params += `${key} = ${value}\n`;
      });
    }
    
    this.logger.log(
      `\n${logHeader}\n${logDate}\n${logAgent}\n${logClientIp}\n${params}`
    );

    next();
  }
}
