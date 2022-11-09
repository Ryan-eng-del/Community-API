import { getJWTPayload, getPoints } from '../common/util'
import moment from 'dayjs'
import UserModel from '../model/UserModel'
import SignRecordModel from '../model/SignRecord'

class UserController {
  /* 用户签到 */
  async userSign(ctx) {
    // 取用户的ID
    const obj = await getJWTPayload(ctx.header.authorization)
    const userId = obj.id
    // 查询用户上一次签到记录
    const record = await SignRecordModel.findByUid(userId)
    const user = await UserModel.findByID(userId)
    let newRecord = {}
    let result = ''
    // 判断签到逻辑
    if (record !== null) {
      // 有历史的签到数据
      // 判断用户上一次签到记录的created时间是否与今天相同
      // 如果当前时间的日期与用户上一次的签到日期相同，说明用户已经签到
      if (
        moment(record.created).format('YYYY-MM-DD') ===
        moment().format('YYYY-MM-DD')
      ) {
        ctx.body = {
          code: 500,
          points: user.points,
          count: user.count,
          lastSign: record.created,
          msg: '用户已经签到'
        }
        return
      } else {
        // 有上一次的签到记录，并且不与今天相同，进行连续签到的判断
        // 如果相同，代表用户是在连续签到
        let count = user.count
        let fav = 0
        // 判断签到时间: 用户上一次的签到时间等于，当前时间的前一天，说明，用户在连续签到
        // 第n+1天签到的时候，需要与第n的天created比较
        if (
          moment(record.created).format('YYYY-MM-DD') ===
          moment().subtract(1, 'days').format('YYYY-MM-DD')
        ) {
          // 连续签到的积分获得逻辑
          count += 1
          fav = getPoints(count)
          await UserModel.updateOne(
            { _id: userId },
            {
              // user.favs += fav
              // user.count += 1
              $inc: { points: fav, count: 1 }
            }
          )
          result = {
            points: user.points + fav,
            count: user.count + 1
          }
        } else {
          // 用户中断了一次签到
          // 第n+1天签到的时候，需要与第n的天created比较，如果不相等，说明中断了签到。
          fav = 5
          await UserModel.updateOne(
            { _id: userId },
            {
              $set: { count: 1 },
              $inc: { favs: fav }
            }
          )
          result = {
            favs: user.points + fav,
            count: 1
          }
        }
        // 更新签到记录
        newRecord = new SignRecordModel({
          uid: userId,
          favs: fav
        })
        await newRecord.save()
      }
    } else {
      // 无签到数据 ->  第一次签到
      await UserModel.updateOne(
        {
          _id: userId
        },
        {
          $set: { count: 1 },
          $inc: { points: 5 }
        }
      )

      newRecord = new SignRecordModel({
        uid: userId,
        favs: 5
      })

      await newRecord.save()

      result = {
        favs: user.points + 5,
        count: 1
      }
    }

    ctx.body = {
      code: 200,
      msg: '请求成功',
      ...result,
      lastSign: newRecord.created
    }
  }
}

export default new UserController()
