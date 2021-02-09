// These are the comments endpoints, used to post comments on images

const express = require('express');
const router = express.Router();
const db = require('../db');
const getDate = require('../db/getDate');
const checkAvatar = require('../db/checkAvatar');
const getId = require('../db/getId');
const pickColor = require('../db/pickColor');
const captcha = require('../db/captcha');
const dotenv = require('dotenv');
const commentAuth = require('../db/commentAuth');
dotenv.config();

// This function checks whether a string is a number, and is used to prevent SQL injections
function isNum(str) {
    return !isNaN(str) &&
            !isNaN(parseFloat(str)) 
}

router.post('/verified', commentAuth, async (req, res) => {
    try {

        /* This endpoint is used when a verified user, a moderator, or an administrator posts a comment. After being 
        authorized using the commentAuth middleware, the comment is scrutinized to make sure that it conforms to all of 
        the requirements. Then, it is determined whether the user selected an avatar. If the user selected an avatar, a 
        query is sent to the database to see if an image with the avatar id exists. If it does, the variable avatar_url 
        will be set to the url of the image with that avatar id. 

        After that, the user session is checked to see whether the user has been assigned a post ID (even if the user 
        is using a badge). If none exists, the user is assigned one along with a color. The variables name, badge, 
        and moment are initialized and correspond to the user's name, badge, and time of posting the comment, 
        respectively. After this, problematic characters such as back slashes are removed, and single quotes have 
        back slashes appended to the beginning in order to prevent the MySQL database from throwing an error when 
        the comment is posted.

        After all that, the comment is sent to the database. If there are no errors, the image that the comment was 
        added to is updated by incrementing the comment count, and the user is sent the insertID. */

        if (req.body.name.length > 30) throw "Username is too long";
        if (req.body.commentText.length > 10000) throw "Comment is too long";
        if (req.body.commentText.length === 0) throw "Empty comment";
        let avatar = (checkAvatar(req.body.avatar)) ? Number(req.body.avatar) : 0;
        const sqlAvatar = `select thumbnail from images where image_id = ${avatar}`;
        let avatar_url = 0;
        if (avatar !== 0){
            const checkImg = await db.getImg(sqlAvatar);
            if (checkImg[0] === undefined){
                avatar = 0;
            } else {
                avatar_url = checkImg[0].thumbnail
            }
        }
        if (req.session.postId === undefined){
            req.session.postId = getId();
        }
        if (req.session.postColor === undefined){
            req.session.postColor = pickColor();
        }
        let name = (req.body.name.length > 0) ? req.body.name : "Anonymous";
        const moment = getDate().date;
        let badge = 0;
        if (req.session.userInfo){
            if (req.session.userInfo.badge){
                badge = req.session.userInfo.badge;
            }
            if (req.session.userInfo.badge !== '0' && req.session.userInfo.badge !== null){
                name = req.session.userInfo.user;
            }
        }
        if (name.split("\\").length > 1){
            name = name.split("\\").join('');
        }
        if (name.split("'").length > 1){
            let splitText = name.split("'")
            for (let i = 1; i < splitText.length; i++){
                splitText[i] = "\\'" + splitText[i];
            }
            name = splitText.join('');
        }
        if (req.body.commentText.split("\\").length > 1){
            req.body.commentText = req.body.commentText.split("\\").join('');
        }
        if (req.body.commentText.split("'").length > 1){
            let splitText = req.body.commentText.split("'")
            for (let i = 1; i < splitText.length; i++){
                splitText[i] = "\\'" + splitText[i];
            }
            req.body.commentText = splitText.join('');
        }
        const sql = `insert into comments values (default, '${req.body.image_id}', '${moment}', '${req.body.user_id}', '${name}', '${req.body.commentText}', '${avatar}', '${avatar_url}', '${req.session.postId}', '${req.session.postColor}', '${badge}', '0', 'null', '${req.connection.remoteAddress}');`
        const comment = await db.postComment(sql);
        const updateCountSql = `update images set comments = comments + 1, latest_comment = ${comment.insertId} where image_id = ${req.body.image_id}`;
        await db.getImg(updateCountSql);
        res.send({
            comment_id: comment.insertId
        });
    } catch(err){
        console.log(err);
        res.send({
            error: err
        })
    }
})

router.post('/', async (req, res) => {
    try {
        
        /* This is the endpoint for users who post comments when they are not logged in. The first thing it does is it 
        sends the user's captcha key to Google reCaptcha to ensure that it is valid. After it does that, everything 
        else is identical to the /verified endpoint minus the badge assignment. */

        const captchaKey = process.env.CAPTCHA_KEY;
        const captchaVerifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${captchaKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;
        const captchaCheck = await captcha.verify(captchaVerifyUrl);
        if (captchaCheck !== "success") throw "Captcha failed. Please try again.";
        if (req.body.name.length > 30) throw "Username is too long";
        if (req.body.commentText.length > 10000) throw "Comment is too long";
        if (req.body.commentText.length === 0) throw "Empty comment";
        let avatar = (checkAvatar(req.body.avatar)) ? Number(req.body.avatar) : 0;
        const sqlAvatar = `select thumbnail from images where image_id = ${avatar}`;
        const checkImg = await db.getImg(sqlAvatar);
        let avatar_url = 0;
        if (avatar !== 0){
            if (checkImg[0] === undefined){
                avatar = 0;
            } else {
                avatar_url = checkImg[0].thumbnail
            }
        }
        if (req.session.postId === undefined){
            req.session.postId = getId();
        }
        if (req.session.postColor === undefined){
            req.session.postColor = pickColor();
        }
        let name = (req.body.name.length > 0) ? req.body.name : "Anonymous";
        const moment = getDate().date;
        let badge = 0;
        if (req.session.userInfo){
            if (req.session.userInfo.badge){
                badge = req.session.userInfo.badge;
            }
            if (req.session.userInfo.badge !== '0' && req.session.userInfo.badge !== null){
                name = req.session.userInfo.user;
            }
        }
        if (name.split("\\").length > 1){
            name = name.split("\\").join('');
        }
        if (name.split("'").length > 1){
            let splitText = name.split("'")
            for (let i = 1; i < splitText.length; i++){
                splitText[i] = "\\'" + splitText[i];
            }
            name = splitText.join('');
        }
        if (req.body.commentText.split("\\").length > 1){
            req.body.commentText = req.body.commentText.split("\\").join('');
        }
        if (req.body.commentText.split("'").length > 1){
            let splitText = req.body.commentText.split("'")
            for (let i = 1; i < splitText.length; i++){
                splitText[i] = "\\'" + splitText[i];
            }
            req.body.commentText = splitText.join('');
        }
        const sql = `insert into comments values (default, '${req.body.image_id}', '${moment}', '${req.body.user_id}', '${name}', '${req.body.commentText}', '${avatar}', '${avatar_url}', '${req.session.postId}', '${req.session.postColor}', '${badge}', '0', 'null', '${req.connection.remoteAddress}');`
        const comment = await db.postComment(sql);
        const updateCountSql = `update images set comments = comments + 1, latest_comment = ${comment.insertId} where image_id = ${req.body.image_id}`;
        await db.getImg(updateCountSql);
        res.send({
            comment_id: comment.insertId
        });
    } catch(err){
        console.log(err);
        res.send({
            error: err
        })
    }
})

router.get('/:id', async (req, res) => {
    try {

        /* This endpoint allows users to be redirected to any comment they want by simply going to nanaimg.net/comments/
        (the comment id) - even if they have no idea what image the comment is on. The way it works is it makes a query 
        to the comment database and determines which image the comment is on, then redirects the user to that image 
        where the comment is located. */

        if (isNum(req.params.id) === true){
            const sql = `select image_id from comments where comment_id = ${req.params.id}`
            const comment = await db.getImg(sql);
            res.redirect(`https://nanaimg.net/image/${comment[0].image_id}#c${req.params.id}`);
        } else {
            res.render('notFound', {
                user: (req.session.userInfo) ? req.session.userInfo.user : 0
            });
        }
    } catch (err){
        res.render('notFound', {
            user: (req.session.userInfo) ? req.session.userInfo.user : 0
        });
    }
})

module.exports = router;