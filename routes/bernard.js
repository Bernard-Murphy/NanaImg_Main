// This is the endpoint that I use for the contact form on my personal website because I didn't want to spend extra money on another mailgun domain. You can disregard this as it has nothing to do with NanaImg.


const express = require('express');
const checkEmail = require('../db/checkEmail');
const db = require('../db');
const Mailgun = require('mailgun-js');
const router = express.Router();

const apiKey = process.env.EMAIL_KEY;
const domain = 'mg.nanaimg.net';

router.post('/', async (req, res) => {
    try {
        let contactSender = req.body.name;
        let contactBody = req.body.body;
        let contactEmail = req.body.email;
        const emailBody = `
        <h3 style="font-size:32px; text-align: center; font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;">${contactSender}</h3><br/>
        <p style="font-size: 18px; text-align: center; font-family: Raleway, 'Times New Roman', Times, serif;">${contactBody}</p><br/>
        <p>${contactEmail}</p>
        `;

        const mailgun = new Mailgun({apiKey: apiKey, domain: domain});

        const data = {
            from: 'accounts@nanaimg.net',
            to: 'murphy.bernard@student.ccm.edu',
            subject: 'You received a message',
            html: emailBody
        }

        mailgun.messages().send(data, async function (err, body) {
            try {
                if (err){
                    console.log(err)
                    res.send({
                        error: "An error occurred. Please try again."
                    })
                } else {
                    res.send({
                        success: "success"
                    })
                }
            } catch (err){
                console.log(err);
                res.send({
                    error: "An error occurred. Please try again."
                })
            }
            
        })
    } catch (err){
        console.log(err);
        res.send({
            error: "An error occurred. Please try again."
        })
    }
})


module.exports = router;