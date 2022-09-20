export type User = Record<'token' | 'avatar' | 'mobile' | 'account' | 'id', string>

/**
 * login登录
 * register注册
 * changeMobile更换手机号
 * forgetPassword找回密码
 * bindMobile绑定三方登录
 */
export type CodeType = 'login' | 'register' | 'changeMobile' | 'forgetPassword' | 'bindMobile'

type OmitUser = Omit<User, 'token'>
export type UserInfo = OmitUser & {
  likeNumber: number
  collectionNumber: number
  score: number
  couponNumber: number
  orderInfo: {
    paidNumber: number
    receivedNumber: number
    shippedNumber: number
    finishedNumber: number
  }
}
