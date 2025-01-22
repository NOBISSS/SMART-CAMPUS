import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mansurianas983@gmail.com",
    pass: "imnvjfiqweuutmyc",
  },
});

async function sendMail(receiversEmail) {
  const otp = Math.floor(Math.random() * 1000000);
  const info = await transporter.sendMail({
    from: "<SmartCampus@noreply.com>", // sender address
    to: `${receiversEmail}`, // list of receivers
    subject: "Smart Campus OTP for student registeration", // Subject line
    text: `Your OTP code is ${otp}. It is valid for 10 minutes.`, // plain text body
    html: "", // html body
  });
  // console.log("InfoMessage:", info.messageId);
  // console.log("OTP sent:", info.response);
  return otp;
}

// const otp = await sendMail("parthchauhan220@gmail.com");
// console.log("Your OTP is", otp);
export default sendMail;
