export enum NotiType {
  IncomingFollow = 'IncomingFollow', // 들어오는 친구 요청
  AcceptFollow = 'AcceptFollow', // 내 요청에 대한 친구의 수락
  FundClose = 'FundClose', // 내 펀딩 마감
  FundAchieve = 'FundAchieve', // 내 펀딩 달성
  NewDonate = 'NewDonate', // 내 펀딩에 들어온 새로운 후원
  DonatedFundClose = 'DonatedFundClose', // 내가 후원한 펀딩 마감
  WriteGratitude = 'WriteGratitude', // 감사인사 작성 권유
  CheckGratitude = 'CheckGratitude', // 내가 후원한 펀딩 감사인사 확인
}

export enum ReqType {
  // NotiType이 IncomingFollow인 경우
  NotResponse = '00', // 요청에 응답하지 않은 상태
  Accept = '01', // 요청을 수락한 상태
  Refuse = '02', // 요청을 거절한 상태

  // NotiType이 WriteGratitude인 경우
  UnWritten = '00', // 감사인사를 작성하지 않은 상태
  Written = '01', // 감사인사를 작성한 상태
}
