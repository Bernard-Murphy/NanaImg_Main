// These routes deal with user reports and moderator/administrator actions

const express = require('express');
const { getImg } = require('../db');
const router = express.Router();
const db = require('../db');
const reportAuth = require('../db/reportAuth');
const getDate = require('../db/getDate');


// Checks whether a string is a number. Used to prevent SQL injections.
function isNum(str) {
    return !isNaN(str) &&
            !isNaN(parseFloat(str)) 
}

router.post('/posts/:id', async (req, res) => {
    try {

        // This endpoint is his when someone reports an image. If the image id is not a number, it throws an error.  
        if (isNum(req.params.id) === false) throw "An error occurred"
        const report = req.body;

        // Ensures there are no backslashes or apostrophes in the report body. I plan to clean this up.

        if (report.additionalInfo.split("\\").length > 1){
            report.additionalInfo = report.additionalInfo.split("\\").join('');
        }
        if (report.additionalInfo.split("'").length > 1){
            let splitText = report.additionalInfo.split("'")
            for (let i = 1; i < splitText.length; i++){
                splitText[i] = "\\'" + splitText[i];
            }
            report.additionalInfo = splitText.join('');
        }
        if (report.postName.split("\\").length > 1){
            report.postName = report.postName.split("\\").join('');
        }
        if (report.postName.split("'").length > 1){
            let splitText = report.postName.split("'")
            for (let i = 1; i < splitText.length; i++){
                splitText[i] = "\\'" + splitText[i];
            }
            report.postName = splitText.join('');
        }
        if (report.postText.split("\\").length > 1){
            report.postText = report.postText.split("\\").join('');
        }
        if (report.postText.split("'").length > 1){
            let splitText = report.postText.split("'")
            for (let i = 1; i < splitText.length; i++){
                splitText[i] = "\\'" + splitText[i];
            }
            report.postText = splitText.join('');
        }

        // Inserts the report into the database.

        const sql = `insert into report_queue values(default, 'post', '${req.params.id}', '${report.reason}', '${report.postName}', '${report.postDate}', '${report.postText}', '${report.additionalInfo}', 'https://nanaimg.net/posts/${req.params.id}')`;
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

router.post('/comments/:id', async (req, res) => {
    try {

        // Same as with images, but with comments instead.

        if (isNum(req.params.id) === false) throw "An error occurred"
        const report = req.body;
        if (report.additionalInfo.split("\\").length > 1){
            report.additionalInfo = report.additionalInfo.split("\\").join('');
        }
        if (report.additionalInfo.split("'").length > 1){
            let splitText = report.additionalInfo.split("'")
            for (let i = 1; i < splitText.length; i++){
                splitText[i] = "\\'" + splitText[i];
            }
            report.additionalInfo = splitText.join('');
        }
        if (report.postName.split("\\").length > 1){
            report.postName = report.postName.split("\\").join('');
        }
        if (report.postName.split("'").length > 1){
            let splitText = report.postName.split("'")
            for (let i = 1; i < splitText.length; i++){
                splitText[i] = "\\'" + splitText[i];
            }
            report.postName = splitText.join('');
        }
        if (report.postText.split("\\").length > 1){
            report.postText = report.postText.split("\\").join('');
        }
        if (report.postText.split("'").length > 1){
            let splitText = report.postText.split("'")
            for (let i = 1; i < splitText.length; i++){
                splitText[i] = "\\'" + splitText[i];
            }
            report.postText = splitText.join('');
        }
        const sql = `insert into report_queue values(default, 'comment', '${report.commentNumber}', '${report.reason}', '${report.postName}', '${report.postDate}', '${report.postText}', '${report.additionalInfo}', 'https://nanaimg.net/comments/${report.commentNumber}')`;
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

router.get('/:off', reportAuth, async (req, res) => {
    try {

        /* :off is the page number of reports in the report queue. There are 50 reports per page, so :off is used to 
        determine the offset when querying the database for reports. */

        const offset = 50 * req.params.off - 50;
        const sql = `select * from report_queue order by report_id desc limit 50 offset ${offset}`;
        const reports = await db.getImg(sql);
        res.send({
            reports: reports
        })
    } catch (err){
        res.send({
            message: "An error occurred"
        })
    }
})

router.get('/', reportAuth, async (req, res) => {
    try {

        // Grabs the 50 oldest reports from the report database. Called from the report queue.

        const sql = 'select * from report_queue order by report_id desc limit 50';
        const reports = await db.getImg(sql);
        res.send({
            reports: reports
        })
    } catch (err){
        res.send({
            message: "An error occurred"
        })
    }
})

router.delete('/comments/:id', reportAuth, async (req, res) => {
    try {

        // Deletes a report about a comment (not the comment itself) from the database.

        const sql = `delete from report_queue where post_type = 'comment' and post_number = ${req.params.id}`;
        await db.getImg(sql);
        res.send({
            response: "success"
        })
    } catch (err) {
        res.send({
            response: "error"
        })
    }
})

router.post('/comment/remove/:id', reportAuth, async (req, res) => {
    try {

        /* This endpoint is used to remove a comment. The variable "reason" is set to the reason given in the request 
        body, then parsed to make sure that backslashes are put before any apostrophes, so that no errors are thrown 
        when it is added to the database. The comment itself is not deleted from the database, rather it is flagged as 
        removed so that only admins and moderators can see it. */

        let reason = req.body.reason;
        if (reason.split("'").length > 1){
            let splitText = reason.split("'")
            for (let i = 1; i < splitText.length; i++){
                splitText[i] = "\\'" + splitText[i];
            }
            reason = splitText.join('');
        }
        const sql1 = `update comments set removed = '1', removed_reason = '${reason}' where comment_id = '${req.params.id}'`;
        await db.getImg(sql1);

        /* The report itself is removed from the database, and a log of the moderator action is inserted into the mod 
        logs table. */

        const sql2 = `delete from report_queue where post_type = 'comment' and post_number = ${req.params.id}`;
        await db.getImg(sql2);
        const logSql = `insert into mod_logs values(default, '${req.session.userInfo.user}', 'removed comment', '${req.params.id}', '${getDate().date}', '${reason}', 'https://nanaimg.net/comments/${req.params.id}')`;
        await db.getImg(logSql);
        res.send({
            message: "Success"
        })
    } catch (err) {
        res.send({
            response: "An error occurred"
        })
    }
})

router.post('/comment/:id', reportAuth, async (req, res) => {
    try {

        // Restores a removed comment and adds a log showing that it was restored, and who restored it.

        const sql1 = `update comments set removed = '0' where comment_id = '${req.params.id}'`;
        await db.getImg(sql1);
        const logSql = `insert into mod_logs values(default, '${req.session.userInfo.user}', 'restored comment', '${req.params.id}', '${getDate().date}', 'n/a', 'https://nanaimg.net/comments/${req.params.id}')`;
        await db.getImg(logSql);
        res.send({
            message: "Success"
        })
    } catch (err) {
        res.send({
            response: "An error occurred"
        })
    }
})

router.post('/manifesto/restore/:id', reportAuth, async (req, res) => {
    try {

        /* Restores a removed manifesto and adds a log to the action logs showing that it was restored, and who 
        restored it. */

        const sql1 = `update images set manifesto_removed = '0' where image_id = '${req.params.id}'`;
        await db.getImg(sql1);
        const logSql = `insert into mod_logs values(default, '${req.session.userInfo.user}', 'restored manifesto', '${req.params.id}', '${getDate().date}', 'n/a', 'https://nanaimg.net/image/${req.params.id}')`;
        await db.getImg(logSql);
        res.send({
            message: "Success"
        })
    } catch (err) {
        res.send({
            response: "An error occurred"
        })
    }
})

router.post('/post/remove/:id', reportAuth, async (req, res) => {
    try {

        // Same as with removing comments, but with images instead.

        let reason = req.body.reason;
        if (reason.split("'").length > 1){
            let splitText = reason.split("'")
            for (let i = 1; i < splitText.length; i++){
                splitText[i] = "\\'" + splitText[i];
            }
            reason = splitText.join('');
        }
        const sql1 = `update images set removed = '1', removed_reason = '${reason}' where image_id = '${req.params.id}'`;
        await db.getImg(sql1);
        const sql2 = `delete from report_queue where post_type = 'post' and post_number = ${req.params.id}`;
        await db.getImg(sql2);
        const logSql = `insert into mod_logs values(default, '${req.session.userInfo.user}', 'removed image', '${req.params.id}', '${getDate().date}', '${reason}', 'https://nanaimg.net/image/${req.params.id}')`;
        await db.getImg(logSql);
        res.send({
            message: "Success"
        })
    } catch (err) {
        res.send({
            response: "An error occurred"
        })
    }
})

router.post('/post/:id', reportAuth, async (req, res) => {
    try {

        // Same as with restoring comments, but with images instead.

        const sql1 = `update images set removed = '0' where image_id = '${req.params.id}'`;
        await db.getImg(sql1);
        const logSql = `insert into mod_logs values(default, '${req.session.userInfo.user}', 'restored image', '${req.params.id}', '${getDate().date}', 'n/a', 'https://nanaimg.net/image/${req.params.id}')`;
        await db.getImg(logSql);
        res.send({
            message: "Success"
        })
    } catch (err) {
        res.send({
            response: "An error occurred"
        })
    }
})

router.delete('/posts/:id', reportAuth, async (req, res) => {
    try {

        // Removes all reports on a specific image

        const sql = `delete from report_queue where post_type = 'post' and post_number = ${req.params.id}`;
        await db.getImg(sql);
        res.send({
            response: "success"
        })
    } catch (err) {
        res.send({
            response: "error"
        })
    }
})

router.post('/manifesto/remove/:id', reportAuth, async (req, res) => {
    try {

        // Removes a manifesto. Same process as removing comments, but with manifestos instead.

        let reason = req.body.reason;
        if (reason.split("'").length > 1){
            let splitText = reason.split("'")
            for (let i = 1; i < splitText.length; i++){
                splitText[i] = "\\'" + splitText[i];
            }
            reason = splitText.join('');
        }
        const sql1 = `update images set manifesto_removed = '1', manifesto_removed_reason = '${reason}' where image_id = '${req.params.id}'`;
        await getImg(sql1);
        const sql2 = `delete from report_queue where post_type = 'post' and post_number = ${req.params.id}`;
        await getImg(sql2);
        const logSql = `insert into mod_logs values(default, '${req.session.userInfo.user}', 'removed manifesto', '${req.params.id}', '${getDate().date}', '${reason}', 'https://nanaimg.net/image/${req.params.id}')`;
        await db.getImg(logSql);
        res.send({
            response: "Success"
        })
    } catch (err) {
        res.send({
            response: "An error occurred"
        })
    }
})

module.exports = router;