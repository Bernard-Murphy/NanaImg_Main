const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');


// If the user is already logged in, they will be redirected to their dashboard. If not, they will be served the login page.

router.get('/', async (req, res) => {
    if (req.session.user){
        res.redirect('/dashboard')
    } else {
        res.render('login');
    }
})

router.post('/', async (req, res) => {
    try {

        // This is the endpoint for users who are logging in using their credentials. A user's password hash, type, id, and badge are pulled from the database. Using Bcrypt's compareSync function, the user is validated and his or her session cookie is updated with all of their information.

        const user = req.body.name;
        const pass = req.body.password;
        const sql = `select password, type, user_id, badge from users where username = '${user}'`;
        const getHash = await db.getImg(sql);
        if (getHash.length){
            const passHash = getHash[0].password;
            const auth = await bcrypt.compareSync(pass, passHash);
            const userInfo = {
                id: getHash[0].user_id,
                user: user,
                role: getHash[0].type,
                badge: getHash[0].badge
            }
            if (auth === true){
                req.session.userInfo = userInfo;
                res.send({
                    success: "success"
                })
            } else {
                res.send({
                    fail: "Incorrect username or password"
                })
            }
        } else {
            res.send({
                fail: "User not found"
            })
        }
    } catch (err) {
        res.sendStatus(500);
    }
})

module.exports = router;