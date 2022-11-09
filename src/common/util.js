import { getValue } from '../config/RedisConfig'
import jwt from 'jsonwebtoken'
import config from '../config'

/* 通过token 在jsonwebtoken当中去解析出用户id */
export const getJWTPayload = (token) => {
  return jwt.verify(token.split(' ')[1], config.JWT_SECRET)
}

/* redis 当中去检查验证码是否相同 */
export const checkCode = async (sid, code) => {
  const redisCode = await getValue(sid)
  let resultBoolean
  if (!redisCode) {
    resultBoolean = false
  } else if (redisCode.toLowerCase() === code.toLowerCase()) {
    resultBoolean = true
  } else {
    resultBoolean = false
  }
  return resultBoolean
}

/* 连续签到获得积分 */
export const getPoints = (count) => {
  let fav
  if (count < 5) {
    fav = 5
  } else if (count >= 5 && count < 15) {
    fav = 10
  } else if (count >= 15 && count < 30) {
    fav = 15
  } else if (count >= 30 && count < 100) {
    fav = 20
  } else if (count >= 100 && count < 365) {
    fav = 30
  } else if (count >= 365) {
    fav = 50
  }
  return fav
}
