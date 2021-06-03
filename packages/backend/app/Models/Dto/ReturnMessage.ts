export enum TypeMessage {
  Error,
  Success,
  Warning
}

export enum StatusCode {
  OK = 200,
  BadRequest = 400,
  Unauthorized,
  PaymentRequired,
  Forbidden,
  NotFound,
  BusinessException = 1000
}

type Message = {
  message: string;
  code?: StatusCode;
  type: TypeMessage
}

export default class ReturnMessage {
  public messages?: Message[]

  public success: boolean

  public response: any
}
