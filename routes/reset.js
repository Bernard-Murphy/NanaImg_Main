// These endpoints are used by people who are resetting their password

const express = require('express');
const db = require('../db');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.get('/:id', async (req, res) => {
    try {

        /* This serves the password reset page. The :id parameter is a randomly generated uuid, and the url would have 
        been emailed to the person who requested the reset. If the reset request is valid, the user is served the reset 
        page. */

        let user = await db.getImg(`select valid from password_resets where uuid = '${req.params.id}'`);
        if (user.length){
            if (user[0].valid === 1){
                res.render('reset');
            } else {
                res.render('invalid');
            }
        } else {
            res.render('invalid');
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
})

router.post('/:id', async (req, res) => {
    try {

        // Makes sure that passwords match, are between 1 and 256 characters, and contain no backslashes.

        if (req.body.newPass){
            let newPass = req.body.newPass;
            if (newPass.length === 0){
                res.send({
                    error: "Password is too short"
                })
            } else if (newPass.length > 256){
                res.send({
                    error: "Password is too long (max: 256 chars)"
                })
            } else if (newPass.split('\\').length > 1){
                res.send({
                    error: "Password contains invalid character '\\'"
                })
            } else {

                /* Resets the user's uuid, hashes and salts the password, invalidates the reset request, then adds the 
                new password and uuid to the user's entry in the users table. */

                const newUId = uuid.v4();
                const passHash = await bcrypt.hash(newPass, 8);
                const userId = await db.getImg(`select user_id from password_resets where uuid = '${req.params.id}'`);
                await db.getImg (`update password_resets set valid = '0' where uuid = '${req.params.id}'`);
                await db.getImg(`update users set password = '${passHash}', uuid = '${newUId}' where user_id = '${userId[0].user_id}';`);
                const getHash = await db.getImg(`select user_id, username, type, badge from users where user_id = '${userId[0].user_id}'`);

                // Logs the user in

                const userInfo = {
                    id: getHash[0].user_id,
                    user: getHash[0].username,
                    role: getHash[0].type,
                    badge: getHash[0].badge
                }
                req.session.userInfo = userInfo;
                res.send({
                    success: 'success'
                })
            }
        } else {
            res.send({
                error: "No password received"
            })
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
})

module.exports = router;