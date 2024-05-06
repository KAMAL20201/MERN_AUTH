import nodemailer from "nodemailer";
export const sendMail = (email, randomString) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "kamalatgeemail@gmail.com",
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: "kamal MERN Auth",
    to: email,
    subject: "Mern-Auth Verify",
    text: "That was easy!",
    html: `Click <a href=http://localhost:3001/verify/${randomString}>here</a> to verify your account`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info);
    }
  });
};
