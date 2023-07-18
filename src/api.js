const express = require('express')
const cors = require('cors')
require('dotenv').config()
const nodemailer = require('nodemailer');
const serverless = require('serverless-http')


const app = express()

app.use(cors())

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    'hello': 'hi!'
  })
})


router.post('/formSubmit', async (req, res) => {
  let body = JSON.parse(Buffer.from(req.body, 'base64').toString());

  const { firstName, lastName, email, phone, message } = body.data
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    name: 'www.gmail.com',
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptionsToDava = {
    from: process.env.EMAIL_ADDRESS,
    to: process.env.EMAIL_ADDRESS_TO,
    subject: `New contact request from: ${firstName} ${lastName}`,
    text: `Name: ${firstName} ${lastName}\nEmail: ${email}\n${phone !== '' ? 'Phone: ' + phone : ''}\n${message !== '' ? 'Message: \n\n' + message : ''}
    `
  };
  const mailOptionsToRequester = {
    from: process.env.EMAIL_ADDRESS,
    to: process.env.EMAIL_ADDRESS_TO,
    subject: `New contact request from: ${firstName} ${lastName}`,
    text: `Name: ${firstName} ${lastName}\nEmail: ${email}\n${phone !== '' ? 'Phone: ' + phone : ''}\n${message !== '' ? 'Message: \n\n' + message : ''}
    `
  };

  // Promise.all([
  //   transporter.sendMail(mailOptionsToDava),
  //   transporter.sendMail(mailOptionsToRequester)
  // ])
  //   .then((res) => res.status(200).send('success'))
  //   .catch((err) => res.status(404))
  transporter.sendMail(mailOptionsToDava, (err, response) => {
    if (err) {
      console.log(err);
      res.status(404)
    } else {
      res.status(200).send('success')
    }
  });
  transporter.sendMail(mailOptionsToRequester, (err, response) => {
    if (err) {
      console.log(err);
      res.status(404)
    } else {
      res.status(200).send('success')
    }
  });
});

app.use('/.netlify/functions/api', router)

module.exports = app
module.exports.handler = serverless(app)
