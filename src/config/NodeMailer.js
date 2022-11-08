'use strict'
import nodeMailer from 'nodemailer'

export async function sendMail(userInfo) {
  const { user, expire } = userInfo
  const transporter = nodeMailer.createTransport({
    host: 'smtp.qq.com',
    port: 587,
    secure: false,
    auth: {
      user: 'cyan0908@qq.com',
      pass: 'szsuigiyqocodjhd' // SMTP 服务生成第三方授权码
    }
  })

  const info = await transporter.sendMail({
    from: '"Fred Foo 👻" <cyan0908@qq.com>', // sender address
    to: 'cyan0908@163.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
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
        <div>您好 ${user}，重置链接有效时间30分钟: ${expire}</div>
        <a
          href="https://localhost"
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
          >重置密码</a
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
  console.log('Message sent: %s', info.messageId)
  console.log('Preview URL: %s', nodeMailer.getTestMessageUrl(info))
}
