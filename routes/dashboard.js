// This script contains all of the dashboard endpoints, which contain all of the administrator and moderator tools, along with 

const express = require('express');
const router = express.Router();
const auth = require('../db/auth');
const pickBadge = require('../db/pickBadge');
const db = require('../db');
const getId = require('../db/getId');


router.get('/', auth, (req, res) => {

    // This route is protected by the auth middleware, which will redirect users to the login screen if they are not logged in. It is then determined whether the user is a moderator, an admin, or a regular verified user. If the user is a moderator or an admin, there are extra options for them to choose from on the dashboard page.

    const role = req.session.userInfo.role;
    const jannyAuths = (role === 'Chadmin' || role === 'Janny') ? true : false;
    const chadminAuths = (role === 'Chadmin') ? true : false;
    try {
        res.render('dashboard', {
            user: req.session.userInfo.user,
            jannyAuths: jannyAuths,
            chadminAuths: chadminAuths
        });
    } catch (err) {
        res.sendStatus(500);
    }
    
})

router.get('/reports', (req, res) => {
    try {

        // Serves the report queue if the user is an administrator or a moderator, and redirects them to the dashboard if not.

        if (req.session.userInfo.role === 'Chadmin' || req.session.userInfo.role === 'Janny'){
            res.render('report_queue', {
                user: (req.session.userInfo) ? req.session.userInfo.user : 0
            });
        } else {
            res.redirect('/dashboard');
        }
    } catch (err) {
        res.redirect('/dashboard');
    }
})

router.get('/registry', (req, res) => {
    try {

        // Serves the user registry if the user is an administrator, and redirects them to the dashboard if not.

        if (req.session.userInfo.role === 'Chadmin'){
            res.render('registry', {
                user: (req.session.userInfo) ? req.session.userInfo.user : 0
            });
        } else {
            res.redirect('/dashboard');
        }
    } catch (err) {
        res.redirect('/dashboard');
    }
})

router.get('/modlogs', (req, res) => {
    try {

        // Serves the user moderator logs if the user is an administrator, and redirects them to the dashboard if not.

        if (req.session.userInfo.role === 'Chadmin'){
            res.render('modlogs', {
                user: (req.session.userInfo) ? req.session.userInfo.user : 0
            });
        } else {
            res.redirect('/dashboard');
        }
    } catch (err) {
        res.redirect('/dashboard');
    }
})

router.get('/settings', auth, (req, res) => {
    try {

        // Serves the settings page

        res.render('settings', {
            user: req.session.userInfo.user,
            role: req.session.userInfo.role
        })
    } catch (err){
        res.sendStatus(500);
    }
})

router.post('/settings/pick', auth, async (req, res) => {
    try {

        // This endpoint recieves a request by users to change the badge that appears next to their names when they post images and comments. For each case, the user's session is analyzed and if they have the proper credentials to be using the requested badge, then their request is granted. Admins can have the admin, moderator or verified badge, moderators can have the moderator or verified badge, and verified users can only use the verified badge. All users may post anonymously if they'd like.

        let newBadge = pickBadge(req.body.pick);
        if (newBadge === 'https://nanaimg.net/assets/chadminmel.png'){
            if (req.session.userInfo.role === 'Chadmin'){
                req.session.userInfo = {
                    ...req.session.userInfo,
                    badge: newBadge
                }
                req.session.postId = getId();
                const sql = `update users set badge = '${newBadge}' where user_id = ${req.session.userInfo.id}`;
                await db.getImg(sql);
                res.send({
                    response: "ok"
                })
            } else {
                res.sendStatus(403)
            }
        } else if (newBadge === 'https://nanaimg.net/assets/spaceedge.png'){
            if (req.session.userInfo.role === 'Chadmin' || req.session.userInfo.role === 'Janny'){
                req.session.userInfo = {
                    ...req.session.userInfo,
                    badge: newBadge
                }
                req.session.postId = getId();
                const sql = `update users set badge = '${newBadge}' where user_id = ${req.session.userInfo.id}`;
                await db.getImg(sql);
                res.send({
                    response: "ok"
                })
            } else {
                res.sendStatus(403);
            }
        } else if (newBadge === 'https://nanaimg.net/assets/verifiedbadge.png'){
            if (req.session.userInfo.role === 'Chadmin' || req.session.userInfo.role === 'Janny' || req.session.userInfo.role === 'Verified'){
                req.session.userInfo = {
                    ...req.session.userInfo,
                    badge: newBadge
                }
                req.session.postId = getId();
                const sql = `update users set badge = '${newBadge}' where user_id = ${req.session.userInfo.id}`;
                await db.getImg(sql);
                res.send({
                    response: "ok"
                })
            } else {
                res.sendStatus(403);
            }
        } else if (newBadge === '0') {
            req.session.userInfo = {
                ...req.session.userInfo,
                badge: newBadge
            }
            req.session.postId = getId();
            const sql = `update users set badge = '${newBadge}' where user_id = ${req.session.userInfo.id}`;
            await db.getImg(sql);
            res.send({
                response: "ok"
            })
        } else {
            throw "An error occurred"
        }
        
    } catch (err) {
        res.sendStatus(500);
    }
})

module.exports = router;