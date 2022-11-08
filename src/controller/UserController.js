import TokenAuth from 'jsonwebtoken'
import moment from 'dayjs'
import config from '../config'
import UserModel from '../model/UserModel'
import { sendMail } from '../config/NodeMailer'
import { genErrorMsg } from '../common/MessageGen'
import { checkCode } from '../common/util'

class UserController {
  /* 登录 */
  async login(ctx) {
    const { body } = ctx.request
    // sid -> uuid, code -> captcha
    const { username, password, sid, code } = body
    const isRightCode = await checkCode(sid, code)
    const isExistUser = await UserModel.findOne({ username })
    /* 检查用户是否注册 */
    if (isExistUser === null) {
      ctx.body = genErrorMsg(500, '请先注册！在登录', ctx)
      return
    }
    /* 检查密码是否正确 */
    const isPasswordValid = await UserModel.findOne({ username, password })
    if (isPasswordValid === null) {
      ctx.body = genErrorMsg(500, '请输入正确的密码', ctx)
      return
    }
    /* 检查验证码是否一致 */
    if (!isRightCode) {
      ctx.body = genErrorMsg(401, '请输入正确的验证码', ctx)
      return
    }
    const token = await TokenAuth.sign({ username }, config.JWT_SECRET, {
      expiresIn: 60 * 60
    })
    ctx.body = {
      code: 200,
      data: isExistUser || isPasswordValid,
      token,
      msg: '登录成功！！'
    }
  }

  /* 注册 */
  async register(ctx) {
    /* name username password */
    const { body } = ctx.request
    const { username, name, password, sid, code } = body
    const isRightCode = await checkCode(sid, code)
    let msg = ''
    let isRegisterValid = true
    /* 检查username 邮箱是否注册过 */
    const userNameValid = await UserModel.findOne({ username: body.username })
    if (userNameValid !== null) {
      msg = '此邮箱已经注册，可以通过邮箱找回密码'
      isRegisterValid = false
    }
    /* 检查昵称是否注册过 */
    const nameValid = await UserModel.findOne({ name: body.name })
    if (nameValid !== null) {
      msg = '此昵称已经注册，可以通过邮箱找回密码'
      isRegisterValid = false
    }
    /* 检查验证码是否一致 */
    if (!isRightCode) {
      ctx.body = genErrorMsg(401, '请输入正确的验证码', ctx)
      return
    }
    /* 检查通过 */
    if (isRegisterValid) {
      const user = new UserModel({ username, name, password })
      const result = await user.save()
      ctx.body = {
        data: result,
        code: 200,
        msg: '注册成功！！'
      }
    } else {
      ctx.response.status = 500
      ctx.body = {
        code: 500,
        msg
      }
    }
  }

  /* 忘记密码 */
  async forget(ctx) {
    const { body } = ctx.request
    const isRegister = await UserModel.findOne({ username: body.username })
    if (isRegister === null) {
      ctx.body = genErrorMsg(409, '请先注册账号', ctx)
      return
    }

    sendMail({
      expire: moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
      email: body.username,
      user: body.username
    }).catch(() => {
      ctx.body = genErrorMsg(503, '发送邮件错误', ctx)
    })

    ctx.body = {
      code: 200,
      msg: '发送邮件成功!'
    }
  }
}

export default new UserController()
