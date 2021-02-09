// These endpoints all have to do with the moderator action logs which are generated any time a moderator or admin removes or restores anything. Only admins are able to see this.

const express = require('express');
const db = require('../db');
const chadminAuth = require('../db/chadminAuth');
const router = express.Router();


router.get('/', chadminAuth, async (req, res) => {
    try{

        // This is the endpoint that is requested when the user goes to the mod logs page. It simply brings up the 200 most recent actions in descending order.

        sql = 'select * from mod_logs order by action_id desc limit 200';
        const logs = await db.getImg(sql);
        res.send({
            response: logs
        })
    } catch (err) {
        res.send({
            response: "An error occurred"
        })
    }
})

router.post('/restore/image/:img/:log', chadminAuth, async (req, res) => {
    try {

        // This reverses an image removal and removes the log from the mod logs.

        const sql1 = `update images set removed = 0 where image_id = ${req.params.img}`;
        await db.getImg(sql1);
        const sql2 = `delete from mod_logs where action_id = ${req.params.log}`;
        await db.getImg(sql2);
        res.send({
            response: "success"
        })
    } catch (err) {
        res.send({
            response: "An error occurred"
        })
    }
})

router.post('/restore/manifesto/:img/:log', chadminAuth, async (req, res) => {
    try {

        // This restores a removed manifesto and removes the log from the database

        const sql1 = `update images set manifesto_removed = 0 where image_id = ${req.params.img}`;
        await db.getImg(sql1);
        const sql2 = `delete from mod_logs where action_id = ${req.params.log}`;
        await db.getImg(sql2);
        res.send({
            response: "success"
        })
    } catch (err) {
        res.send({
            response: "An error occurred"
        })
    }
})

router.post('/restore/comment/:com/:log', chadminAuth, async (req, res) => {
    try {

        // This restores a removed comment and removes the action log from the database.

        const sql1 = `update comments set removed = 0 where comment_id = ${req.params.com}`;
        await db.getImg(sql1);
        const sql2 = `delete from mod_logs where action_id = ${req.params.log}`;
        await db.getImg(sql2);
        res.send({
            response: "success"
        })
    } catch (err) {
        res.send({
            response: "An error occurred"
        })
    }
})

router.post('/remove/image/:img/:log', chadminAuth, async (req, res) => {
    try {

        // This reverses an image restoration, thus removing the image, and removes the action log from the database.

        const sql1 = `update images set removed = 1 where image_id = ${req.params.img}`;
        await db.getImg(sql1);
        const sql2 = `delete from mod_logs where action_id = ${req.params.log}`;
        await db.getImg(sql2);
        res.send({
            response: "success"
        })
    } catch (err) {
        res.send({
            response: "An error occurred"
        })
    }
})

router.post('/remove/manifesto/:img/:log', chadminAuth, async (req, res) => {
    try {

        // This reverses the restoration of a manifesto, thus removing it, and removes the action log from the database.

        const sql1 = `update images set manifesto_removed = 1 where image_id = ${req.params.img}`;
        await db.getImg(sql1);
        const sql2 = `delete from mod_logs where action_id = ${req.params.log}`;
        await db.getImg(sql2);
        res.send({
            response: "success"
        })
    } catch (err) {
        res.send({
            response: "An error occurred"
        })
    }
})

router.post('/remove/comment/:com/:log', chadminAuth, async (req, res) => {
    try {

        // This reverses the restoration of a comment, thus removing it, and deletes the action log from the database.

        const sql1 = `update comments set removed = 1 where comment_id = ${req.params.com}`;
        await db.getImg(sql1);
        const sql2 = `delete from mod_logs where action_id = ${req.params.log}`;
        await db.getImg(sql2);
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