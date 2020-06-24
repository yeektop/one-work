// 云函数入口文件
const cloud = require('wx-server-sdk')
const nodemailer = require("nodemailer");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const { to, subject, html = '' } = event
  let transporter = nodemailer.createTransport({
    host: "smtp.exmail.qq.com", //SMTP服务器地址
    port: 465, //端口号，通常为465，587，25，不同的邮件客户端端口号可能不一样
    secure: true, //如果端口是465，就为true;如果是587、25，就填false
    auth: {
      user: "system@yeek.top",  //你的邮箱账号
      pass: "sDmgq5h65e1a"   //邮箱密码，QQ的需要是独立授权码，不是QQ邮箱的密码
    }
  });

  let message = {
    from: 'system@yeek.top',   //你的发件邮箱
    to, //你要发给谁
    // cc:'',  支持cc 抄送
    // bcc: '', 支持bcc 密送
    subject,

    //支持text纯文字，html代码
    // text: '搞快点搞快点',
    html:
      html +
      '<p>感谢您的使用<b>一作业</b></p>' +
      '<img src="https://markdown.yeek.top/minicode.png" />',
    // attachments: [  //支持多种附件形式，可以是String, Buffer或Stream
    //   {
    //     filename: 'image.png',
    //     content: Buffer.from(
    //       'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/' +
    //       '//+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4U' +
    //       'g9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC',
    //       'base64'
    //     ),
    // },
    // ]
  };

  let res = await transporter.sendMail(message);
  return res;
}