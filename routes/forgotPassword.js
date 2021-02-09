// These are the endpoints that handle requests by users who cannot remember their password.


const express = require('express');
const checkEmail = require('../db/checkEmail');
const db = require('../db');
const Mailgun = require('mailgun-js');
const dotenv = require('dotenv');
dotenv.config();
const router = express.Router();

const apiKey = process.env.EMAIL_KEY;
const domain = 'mg.nanaimg.net';


// Renders the forgot password page
router.get('/', (req, res) => {
    res.render('forgotPassword');
});

router.post('/', async (req, res) => {
    try {

        // Checks to make sure the credentials are potentially valid before making a call to the database.

        let username = req.body.username;
        let email = req.body.email;
        if (checkEmail(email) === false){
            res.send({
                error: "Please enter a valid email"
            })
        } else if (username === '' || username.length > 30){
            res.send({
                error: "Please enter a valid username"
            })
        } else {

            // Pulls a user from the database given the username and email they provided. If the user exists, a password reset request is entered into the database and an email is generated with a link to the request. A uuid previously generated is used to generate the password reset url. Mailgun is used to send the reset email.

            let userCheck = await db.getImg(`select uuid, user_id from users where username = '${username}' and email = '${req.body.email}'`);
            if (userCheck.length){
                let urlId = userCheck[0].uuid.split('-').join('');
                await db.getImg(`insert into password_resets values(default, '${userCheck[0].user_id}', '${urlId}', '1');`);
                const emailBody = `
                <h3 style="font-size:32px; text-align: center; font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;">You requested a password reset</h3><br/>

                <p style="font-size: 18px; text-align: center; font-family: Raleway, 'Times New Roman', Times, serif;">To reset your password, go to the following link:</p><br/>

                <a style="display:block; margin: 0 auto;font-size: 18px; text-align: center; font-family: Raleway, 'Times New Roman', Times, serif;" href="https://nanaimg.net/reset/${urlId}">https://nanaimg.net/reset/${urlId}</a>
                `;

                const mailgun = new Mailgun({apiKey: apiKey, domain: domain});

                const data = {
                    from: 'accounts@nanaimg.net',
                    to: email,
                    subject: 'Password reset request - NanaImg.net',
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
            } else {
                res.send({
                    error: "No user with those records found"
                })
            }
        }
    } catch (err){
        console.log(err);
        res.send({
            error: "An error occurred. Please try again."
        })
    }
})

module.exports = router;