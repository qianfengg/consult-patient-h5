// 问诊类型
export enum ConsultType {
  Doctor = 1,
  Fast = 2,
  Medication = 3
}
// 问诊时间，以1自增可以省略
export enum ConsultTime {
  Week = 1,
  Month,
  HalfYear,
  More
}
// 消息类型
export enum MsgType {
  MsgText = 1,
  MsgImage = 4,
  CardPat = 21,
  CardPre = 22,
  CardEvaForm = 23,
  CardEva = 24,
  Notify = 31,
  NotifyTip = 32,
  NotifyCancel = 33
}

// 处方状态
export enum PrescriptionStatus {
  NotPayment = 1,
  Payment = 2,
  Invalid = 3
}

export enum OrderType {
  ConsultPay = 1,
  ConsultWait = 2,
  ConsultChat = 3,
  ConsultComplete = 4,
  ConsultCancel = 5,
  MedicinePay = 10,
  MedicineSend = 11,
  MedicineTake = 12,
  MedicineComplete = 13,
  MedicineCancel = 14
}

export enum ExpressStatus {
  // 已发货
  Delivered = 1,
  // 已揽件
  Received = 2,
  // 运输中
  Transit = 3,
  // 派送中
  Delivery = 4,
  // 已签收
  Signed = 5
}
