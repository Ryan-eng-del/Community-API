import svgCaptcha from 'svg-captcha'
import { setValue } from '../config/RedisConfig'

class PublicController {
  async getCaptcha(ctx) {
    const query = ctx.query
    const captcha = svgCaptcha.create({
      size: 4,
      ignoreChars: '0oO1ilLI',
      noise: Math.floor(Math.random() * 3),
      width: 150,
      height: 38
    })

    if (typeof query.sid === 'undefined') {
      ctx.body = {
        code: 500,
        msg: '请传入UUID来获取验证码！'
      }
      return
    }
    await setValue(query.sid, captcha.text, 60 * 10)

    ctx.body = {
      code: 200,
      data: captcha
    }
  }
}

export default new PublicController()
