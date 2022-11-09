import nodeMailer from 'nodemailer'
import config from '.'
import qs from 'qs'

export async function sendMail(sendInfo) {
  const transporter = nodeMailer.createTransport({
    host: 'smtp.qq.com',
    port: 587,
    secure: false,
    auth: {
      user: 'cyan0908@qq.com',
      pass: 'rvfhdbfwhkgsdicc' // SMTP 服务生成第三方授权码
    }
  })

  const baseUrl = config.BASE_URL
  const route = sendInfo.type === 'email' ? '/confirm' : '/reset'
  const url = `${baseUrl}/#${route}?` + qs.stringify(sendInfo.data)

  const info = await transporter.sendMail({
    from: '"Community Official 👻" <cyan0908@qq.com>', // sender address
    to: sendInfo.email, // list of receivers
    subject: 'Hello ✔ My User ' + sendInfo.user, // Subject line
    text:
      sendInfo.user !== '' && sendInfo.type !== 'email'
        ? `Community Official ${
            sendInfo.type === 'reset' ? '重置密码链接！' : '注册码！'
          }`
        : '更新绑定的邮箱', // plain text body
    html: `
         <div
      style="
        border: 1px solid #dcdcdc;
        color: #676767;
        width: 600px;
        margin: 0 auto;
        padding-bottom: 50px;
        position: relative;
      "
    >
      <div
        style="
          height: 60px;
          background: #393d49;
          line-height: 60px;
          color: white;
          font-size: 18px;
          padding-left: 10px;
          text-align: center;
        "
      >
        Welcome to the Official Community!!
      </div>
      <div style="padding: 25px; text-align: center">
        <div>您好 ${sendInfo.user}，重置链接有效时间30分钟: ${
      sendInfo.expire
    },之前${
      sendInfo.code
        ? '重置您的密码'
        : '修改您的邮箱为：' + sendInfo.data.username
    }</div>
        <a
          href="${url}"
          style="
            width: 100px;
            height: 50px;
            text-align: center;
            line-height: 50px;
            text-decoration: none;
            color: #fff;
            background: #009e94;
            display: block;
            margin: 30px auto;
          "
          >${sendInfo.type === 'reset' ? '立即重置密码' : '确认设置邮箱'}</a
        >

      </div>
      <div
        style="
          background: #fafafa;
          color: #b4b4b4;
          text-align: center;
          line-height: 45px;
          height: 45px;
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
        "
      >
        系统邮件，请勿直接回复
      </div>
    </div>
    `
  })

  return `Message sent: %s, ${info.messageId}`
}
