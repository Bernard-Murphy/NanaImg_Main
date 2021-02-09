// These routes handle the registration of new users, along with their acceptance or rejection by site administrators.


const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const getDate = require('../db/getDate');
const checkEmail = require('../db/checkEmail');
const chadminAuth = require('../db/chadminAuth');
const uuid = require('uuid');


// Serves the registration page
router.get('/', (req, res) => {
    res.render('register');
})

router.post('/deny/:id', chadminAuth, async (req, res) => {
    try {

        /* Rejects a users registration. After this, when a user logs in, they will be served a page that tells them that their application has been rejected. */

        const sql = `update users set type = 'rejected' where user_id = '${req.params.id}'`;
        await db.getImg(sql);
        res.send({
            response: "Success"
        })
    } catch (err) {
        res.send({
            response: "An error occurred"
        })
    }
})

router.post('/approve/:id', chadminAuth, async (req, res) => {
    try {

        /* When a user is approved by an administrator, his or her account will be marked as such in the database. This 
        sets their badge and their role in the database. */

        let role = req.body.role;
        let badge = null;
        if (role === 'Chadmin'){
            badge = 'https://nanaimg.net/assets/chadminmel.png';
        } else if (role === 'Janny'){
            badge = 'https://nanaimg.net/assets/spaceedge.png';
        } else if (role === 'Verified'){
            badge = 'https://nanaimg.net/assets/verifiedbadge.png';
        }
        const sql = `update users set registration_approved = '1', type = '${role}', badge = '${badge}' where user_id = ${req.params.id}`
        await db.getImg(sql);
        res.send({
            response: "Success"
        })
    } catch (err) {
        res.send({
            response: "An error occurred"
        })
    }
})

router.post('/', async (req, res) => {
    try {

        /* This is the endpoint that gets hit when a user submits a new registration. This first block ensures that the 
        user's name, password, and email are within all of the acceptable parameters. Names must be between 1 and 30 
        characters long, emails must be valid emails with a maximum of 128 characters, passwords must match and can be 
        a maximum of 256 characters, and backslashes and apostrophes are not allowed in either usernames, passwords, or 
        emails. */

        if (req.body.name.length > 30) throw "Your username is too long (max: 30 characters)";
        if (req.body.password1 !== req.body.password2) throw "Your passwords do not match";
        if (checkEmail(req.body.email) === false) throw "Please provide a valid email";
        if (req.body.password1.length > 256) throw "Your password is too long (max: 256 characters)";
        if (req.body.email.length > 128) throw "Your email is too long (max: 128 characters)";
        if (req.body.name.length < 1) throw "Your username is too short";
        if (req.body.name.split('\\').length > 1) throw "Invalid character '\\' in username";
        if (req.body.password1.split('\\').length > 1) throw "Invalid character '\\' in password";
        if (req.body.email.split('\\').length > 1) throw "Invalid character '\\' in email";
        if (req.body.name.split('\'').length > 1) throw "Invalid character '\'' in username";
        if (req.body.password1.split('\'').length > 1) throw "Invalid character '\'' in password";
        if (req.body.email.split('\'').length > 1) throw "Invalid character '\'' in email";

        // Checks whether the username or email has already been used by another user

        const sql1 = `select * from users where username = '${req.body.name}'`;
        const check = await db.getImg(sql1);
        if (check.length > 0) throw "User already exists with that name";
        const sql3 = `select * from users where email = '${req.body.email}'`;
        const check2 = await db.getImg(sql3);
        if (check2.length > 0) throw "User already exists with that email";
        
        /* The uuid generated here is used when the user is uploading images. Because the image server and the main 
        server (this one) are separate, I cannot use session cookies to verify a user's credentials. So instead I use 
        this uuid, which gets refreshed every time a user uploads a new image (so that malicious users cannot use it 
        for themselves). */

        const verid = uuid.v4();

        /* Password is hashed and salted, the date is generated, and the user is added to the database. They must be 
        approved before their account has full privileges. */

        const passHash = await bcrypt.hash(req.body.password1, 8);
        const date = getDate().date;
        const sql2 = `insert into users values(default, 'applicant', '${req.body.name}', '${passHash}', '${req.body.email}', 'applicant', 'needs review', '${date}', 'n/a', 'null', '0', '${verid}')`;
        await db.getImg(sql2);
        res.send({
            success: "success"
        })
    } catch (err) {
        res.send({
            fail: err
        })
    }
})

module.exports = router;