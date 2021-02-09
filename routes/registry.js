const express = require('express');
const router = express.Router();
const db = require('../db');
const chadminAuth = require('../db/chadminAuth');



router.get('/unapproved', chadminAuth, async (req, res) => {
    try {

        /* Obtains a list of the last 50 people who have registered but whose registrations have not yet been 
        processed. */

        const sql = `select * from users where registration_approved = 0 and type != 'rejected' limit 50`;
        const registry = await db.getImg(sql);
        res.send({
            response: registry
        })
    } catch (err){
        res.send({
            response: "An error occurred"
        })
    }
})

router.get('/', chadminAuth, async (req, res) => {
    try {

        // Obtains a list of approved users. This includes admins, moderators, and verified users.

        const sql = `select * from users where registration_approved = 1 and type != 'Banned'`;
        const registry = await db.getImg(sql);
        res.send({
            response: registry
        })
    } catch (err){
        res.send({
            response: "An error occurred"
        })
    }
})

router.post('/:id', chadminAuth, async (req, res) => {
    try {
        
        /* This is the endpoint that gets hit when an admin updates the properties of a user. An admin can update a 
        user's role, email address, or comments on their account. */

        let badge = null
        let email = req.body.email;
        let role = req.body.role;
        if (role === 'Chadmin'){
            badge = 'https://nanaimg.net/assets/chadminmel.png';
        } else if (role === 'Janny'){
            badge = 'https://nanaimg.net/assets/spaceedge.png';
        } else if (role === 'Verified'){
            badge = 'https://nanaimg.net/assets/verifiedbadge.png';
        }
        let comments = req.body.comments;

        // Ensuring there are no backslashes in the email or comments as they tend to throw MySQL errors.

        if (email.split("\\").length > 1){
            email = email.split("\\").join('');
        }
        if (email.split("'").email > 1){
            let splitText = email.split("'")
            for (let i = 1; i < splitText.length; i++){
                splitText[i] = "\\'" + splitText[i];
            }
            email = splitText.join('');
        }
        if (comments.split("\\").length > 1){
            comments = comments.split("\\").join('');
        }
        if (comments.split("'").comments > 1){
            let splitText = comments.split("'")
            for (let i = 1; i < splitText.length; i++){
                splitText[i] = "\\'" + splitText[i];
            }
            comments = splitText.join('');
        }
        sql = `update users set email = '${email}', type = '${role}', status_comments = '${comments}', badge = '${badge}' where user_id = '${req.params.id}'`;
        await db.getImg(sql);
        res.send({
            response: "success"
        })
    } catch (err) {
        res.send({
            response: "An error occurred"
        })
    }
})

module.exports = router;