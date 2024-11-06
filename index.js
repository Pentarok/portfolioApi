require('dotenv').config(); 
const express = require('express');

const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: process.env.FRONT_END_URL,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.listen(3000,()=>{
    console.log("server is running on port 3000");
})

const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use any other email service provider
    auth: {
      user: process.env.EMAIL_USER,  // Email user from .env file
      pass: process.env.EMAIL_PASS   // Email password from .env file
    }
  });

app.post('/message',(req,res)=>{
     if (req.method === 'OPTIONS') {
    res.status(200).end()
  
  }
try {
  const {name , email, message}=req.body;
    const mailOptions = {
        from:email,
        to: process.env.EMAIL_USER,
        subject: 'Message from your website',
        html: `
          <p>Name: ${name}</p>
          <p>Email: ${email}</p>
          <p>Message: ${message}</p>
        `
      };
    
      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ error: "Failed to send email" });
        } else {
          console.log('Email sent: ' + info.response);
          return res.json('Ok');
        }})
} catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
}
})
app.use('*', (req, res) => {
    res.status(404).send('Hello from PortFolio Api');
});

