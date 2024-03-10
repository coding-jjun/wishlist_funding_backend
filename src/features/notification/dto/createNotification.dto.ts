import { IsNotEmpty } from "class-validator";
import { NotiType, ReqType } from "src/enums/notification.enum";

export class CreateNotificationDto {
	@IsNotEmpty()
	recvId: number;

	@IsNotEmpty()
	sendId: number;

	@IsNotEmpty()
	notiType: NotiType;

    @IsNotEmpty()
    reqType: ReqType;

    @IsNotEmpty()
    subId: number;
}