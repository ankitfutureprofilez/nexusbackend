const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const serverless = require("serverless-http");
const cors = require("cors");
const nodemailer = require("nodemailer");

const corsOptions = {
  origin: "*",
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: '*',
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '2000mb' }));
app.use(express.urlencoded({ extended: true, limit: "2000mb" }));


const PORT = process.env.REACT_APP_SERVER_DOMAIN || 5100;

// Email logic

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST, // Gmail SMTP server
  port: process.env.MAIL_PORT, // Port for SSL
  secure: true, // Use SSL for port 465
  auth: {
    user: process.env.MAIL_USERNAME, // Your Gmail address
    pass: process.env.MAIL_PASSWORD, // Your app password
  },
});
const sendMail = async (mailOptions) => {
  try {
    const info = await transporter.sendMail(mailOptions);
    if (info.messageId) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Mail error:", error);
    return false;
  }
};

app.post("/form", async (req, res) => {
  const { name, email, phone, society, message } = req.body;
  if (!name || !email || !phone || !society || !message) {
    return res.status(201).json({
      message: "All fields are required",
      status: false,
    })
  }
  const mailOptions = {
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`, // sender address with name
    to: "manageyoursociety@gmail.com", // recipient addresses
    subject: `New inquiry received`, // Subject line
    html: `
       <html>

<head>
  <title>Email template</title>
</head>

<body style="background: #f5f5f5;">
  <table cellspacing="0" cellpadding="0"
    style="width: 100%;max-width: 400px;margin: 0 auto;font-family: Arial;background: #f5f5f5; border: 1px solid #e5e5e5; ">
    <tr>
      <td style="text-align: center;background:#ffff;padding: 1.3em 1.3em;">
        <a href="https://futureprofilez.com/">
          <img style="max-width:140px; height:42px" src="https://i.ibb.co/QF0JZfYV/logo.png" alt="">
        </a>
      </td>
    </tr>
    <tr>
      <td style="padding: 1.4em 1.3em; ">
        <p
          style="color: #14D4D4D;font-size: 16px;font-weight: 400; letter-spacing: -0.04em; text-align: left;line-height: 22px;margin: 0 0 8px;">
          Dear Admin,</p>
        <p
          style="color: #4D4D4D;font-size: 16px;font-weight: 400; letter-spacing: -0.04em; text-align: left;line-height: 22px;margin: 0">
          We have received a new inquiry.Please find the details attached below.</p>
      </td>
    </tr>
    <tr>
      <td colspan="2" style="border: solid 1px #e5e5e5; padding:1.5em 1.3em;color: #4D4D4D;">
        <p style="font-size:16px;margin:0 0 12px 0;">
          <span style="font-weight:bold;display:inline-block;">Name : </span> <b
            style="font-weight:normal;margin:0">${name}</b>
        </p>
        <p style="font-size:16px;margin:0 0 12px 0;">
          <span style="font-weight:bold;display:inline-block;">Email : </span> ${email}
        </p>
        <p style="font-size:16px;margin:0 0 12px 0;">
          <span style="font-weight:bold;display:inline-block;">Phone No. : </span> ${phone}
        </p>
        <p style="font-size:16px;margin:0 0 12px 0;">
          <span style="font-weight:bold;display:inline-block;">Society : </span> ${society}
        </p>
        <p style="font-size:16px;margin:0 0 12px 0;">
          <span style="font-weight:bold;display:inline-block;">Message : </span>
        </p>
        <p style="font-size:16px;margin:0 0 0;">${message}</p>
      </td>
    </tr>
    <tr>
      <td style="text-align: left;padding:1.3em 1.3em;background: #000B26;text-align: center;">

        <a href="#" target="blank" style="color:#4D4D4D; font-size:14px; text-decoration: none;">
          <img style="margin-right: 5px; vertical-align: top;" src="https://i.ibb.co/Qvrcj25G/facebook.png" alt="img">
        </a>

        <a href="#" target="blank" style="color:#4D4D4D; font-size:14px; text-decoration: none;">
          <img style="margin-right: 5px; vertical-align: middle;" src="https://i.ibb.co/5P9Sfwt/insta.png" alt="img">
        </a>
        <a href="#" target="blank" style="color:#4D4D4D; font-size:14px; text-decoration: none;">
          <img style="margin-right: 5px; vertical-align: middle;" src="https://i.ibb.co/Rpqn3NxF/linkdin.png" alt="img">
        </a>
      </td>
    </tr>
    <tr>

      <td
        style="text-align: left;padding:19.2px 19.2px 1rem; border-top:1px solid rgba(255,255,255,.1); text-align: center;    background: #000B26;">
        <div style="margin: 0 0 10px">
          <img style="margin-right: 3px; vertical-align: top;" src="https://i.ibb.co/hF5pVZyq/phone.png" alt="img">
          <a href="tel:+918899999987" style="color:#ffffff; font-size:14px; text-decoration: none; opacity: 0.8;">+91
            8899999987</a>
        </div>
        <div style="margin: 0 0 10px">
          <img style="margin-right: 3px; vertical-align: middle;" src="https://i.ibb.co/tTdm63wd/email.png" alt="img">
          <a href="mailto:manageyoursociety@gmail.com"
            style="color:#ffffff; font-size:14px; text-decoration: none; opacity: 0.8;">manageyoursociety@gmail.com</a>
        </div>
        <div style="line-height: 24px;">
          <a href="#" target="blank" style="color:#ffffff; font-size:14px; text-decoration: none;">
            <img style="margin-right: 3px; vertical-align: middle;" src="https://i.ibb.co/63v1NWX/address.png"
              alt="img">
            <span style="opacity: 0.8"> Jaipur, Rajasthan</span>
          </a>
        </div>
      </td>
    </tr>
  </table>
</body>

</html>
          `,
  };

  try {
    const sendMailResponse = await sendMail(mailOptions);

    if (!sendMailResponse) {
      throw new Error("Failed to send email");
    }

    console.log("Email sent successfully");

    return res.status(201).json({
      status: true,
      message: "Enquiry Added Successfully!",
    });
  } catch (error) {
    console.error("Error in sending email:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to send email. Please try again later.",
    });
  }
});

app.get("/", (req, res) => {
  res.json({
    msg: 'Hello GHP Society',
    status: 200,
  });
});

const server = app.listen(PORT, () => console.log("Server is running at port : " + PORT));
server.timeout = 360000; // 6 minutes
module.exports = app;
module.exports.handler = serverless(app);

