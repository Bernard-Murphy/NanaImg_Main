const express = require('express');
const router = express.Router();
const db = require('../db');
const getBadgeColor = require('../db/getBadgeColor');

// Checks to see if the string is a number. Used to prevent SQL injections
function isNum(str) {
    return !isNaN(str) &&
            !isNaN(parseFloat(str)) 
}

router.get('/:id', async (req, res) => {
    try {

        /* This endpoint is used to serve the main image pages that show the images with comments and view count and 
        everything else. The first thing it does is it checks whether the user is verified. This will determine whether 
        the user is served the reCaptcha challenge. */

        let verified = false;
        if (req.session){
            if (req.session.userInfo){
                if (req.session.userInfo.role === "Chadmin" || req.session.userInfo.role === "Verified" || req.session.userInfo.role === "Janny"){
                    verified = true;
                }
            }
        }

        /* Selects the image that the user wants, as well as the IDs of the previous and next images which aren't 
        removed, if they exist. These will be used for the "next" and "previous buttons at the top of the image page." 
        */

        if (isNum(req.params.id)){
            let result = await db.getImg(`select * from images where image_id = ${req.params.id}`);
            let nextResult = await db.getImg(`select image_id from images where image_id > ${req.params.id} and removed = 0 order by image_id asc limit 1`);
            let prevResult = await db.getImg(`select image_id from images where image_id < ${req.params.id} and removed = 0 order by image_id desc limit 1`);

            /* The access variable is initialized false. If the user is an administrator or a moderator, it will be 
            changed to true. This allows the user to remove and restore images, manifestos, and comments. */

            let access = false;
            if (result.length){
                if (req.session){
                    if (req.session.userInfo){
                        if (req.session.userInfo.role === 'Chadmin' || req.session.userInfo.role === 'Janny'){
                            access = true;
                        }
                    }
                }

                /* If the image is removed and the user does not have access, they will be directed to a page telling 
                them the image has been removed. */

                if (result[0].removed === 1 && access === false){
                    res.render('removed', {
                        user: (req.session.userInfo) ? req.session.userInfo.user : 0
                    });
                } else {

                    /* If the image is marked "NSFW" and the user has not yet confirmed that he or she is over the age 
                    of 18 and willing to see NSFW images, they will be redirected to the NSFW page. */

                    if (result[0].nsfw === 1){
                        if (req.session.nsfw === false || req.session.nsfw === undefined){
                            req.session.splash = req.originalUrl;
                            res.redirect('/nsfw');
                        } else {

                            /* Sets several variables which are properties of the image. user is the person who posted 
                            the image. manifesto is the text of the manifesto if there is one that is not removed. 
                            imgId is the image id. previous and next are the image ids of the previous and next images, 
                            respectively. */

                            const user = result[0].user;
                            const manifesto = (result[0].manifesto === "null" || result[0].manifesto_removed === 1) ? 0 : result[0].manifesto;
                            const imgId = result[0].image_id;
                            const previous = (prevResult.length === 0) ? 0 : prevResult[0].image_id;
                            const next = (nextResult.length === 0) ? 0 : nextResult[0].image_id;

                            /* Fetches all of the comments or only the comments that are not removed, depending upon 
                            whether the user has access to them. Then, updates the image by increasing its view count 
                            by one. */

                            let sqlAll = `select * from comments where image_id = ${imgId} and removed = '0' limit 200`;
                            if (access === true){
                                sqlAll = `select * from comments where image_id = ${imgId} limit 200`;
                            }
                            const commentsAll = await db.fetchComments(sqlAll);
                            const updateCountSql = `update images set views = views + 1 where image_id = ${req.params.id}`;
                            await db.getImg(updateCountSql);

                            /* If there are more than 200 comments on the image, commentExcess is set to true, which 
                            will add "previous" and "next" buttons in the comments section so that users can navigate 
                            through the comments. */

                            let commentExcess = (result[0].comments > 200) ? true : false;
                            let nextComments = (result[0].comments > 200) ? 2 : 0;
                            res.render('image', {
                                imgsrc: `https://img.nanaimg.net/img/${result[0].filename}`,
                                direct_link: `https://img.nanaimg.net/img/${result[0].filename}`,
                                imgnum: result[0].image_id,
                                comments: commentsAll,
                                commentNumber: result[0].comments,
                                next: next,
                                previous: previous,
                                user: user,
                                manifesto: manifesto,
                                date: result[0].date,
                                nsfw: result[0].nsfw,
                                opid: (result[0].badge === "0") ? result[0].poster_id : 0,
                                opColor: result[0].poster_css_color,
                                loggedUser: (req.session.userInfo) ? req.session.userInfo.user : 0,
                                opBadge: result[0].badge,
                                badgeColor: (result[0].badge === "0") ? 0 : getBadgeColor(result[0].badge),
                                commentsDisabled: result[0].comments_disabled,
                                removed: result[0].removed,
                                removedReason: result[0].removed_reason,
                                manifestoRemoved: result[0].manifesto_removed,
                                manifestoRemovedReason: result[0].manifesto_removed_reason,
                                access: access,
                                views: result[0].views + 1,
                                commentExcess: commentExcess,
                                previousComments: false,
                                nextComments: nextComments,
                                commentPage: 1,
                                verified: verified
                            });
                        }
                    } else {

                        // This section is identical to the last, minus the NSFW part.

                        const user = result[0].user;
                        const manifesto = (result[0].manifesto === "null" || result[0].manifesto_removed === 1) ? 0 : result[0].manifesto;
                        const imgId = result[0].image_id;
                        const previous = (prevResult.length === 0) ? 0 : prevResult[0].image_id;
                        const next = (nextResult.length === 0) ? 0 : nextResult[0].image_id;
                        let sqlAll = `select * from comments where image_id = ${imgId} and removed = '0' limit 200`;
                        if (access === true){
                            sqlAll = `select * from comments where image_id = ${imgId} limit 200`;
                        }
                        const commentsAll = await db.fetchComments(sqlAll);
                        const updateCountSql = `update images set views = views + 1 where image_id = ${req.params.id}`;
                        await db.getImg(updateCountSql);
                        let commentExcess = (result[0].comments > 200) ? true : false;
                        let nextComments = (result[0].comments > 200) ? 2 : 0;
                        res.render('image', {
                            imgsrc: `https://img.nanaimg.net/img/${result[0].filename}`,
                            direct_link: `https://img.nanaimg.net/img/${result[0].filename}`,
                            imgnum: result[0].image_id,
                            comments: commentsAll,
                            commentNumber: result[0].comments,
                            next: next,
                            previous: previous,
                            user: user,
                            manifesto: manifesto,
                            date: result[0].date,
                            nsfw: result[0].nsfw,
                            opid: (result[0].badge === "0") ? result[0].poster_id : 0,
                            opColor: result[0].poster_css_color,
                            loggedUser: (req.session.userInfo) ? req.session.userInfo.user : 0,
                            opBadge: result[0].badge,
                            badgeColor: (result[0].badge === "0") ? 0 : getBadgeColor(result[0].badge),
                            commentsDisabled: result[0].comments_disabled,
                            removed: result[0].removed,
                            removedReason: result[0].removed_reason,
                            manifestoRemoved: result[0].manifesto_removed,
                            manifestoRemovedReason: result[0].manifesto_removed_reason,
                            access: access,
                            views: result[0].views + 1,
                            commentExcess: commentExcess,
                            previousComments: false,
                            nextComments: nextComments,
                            commentPage: 1,
                            verified: verified
                        });
                    }
                }
            } else {
                res.render('notFound', {
                    user: (req.session.userInfo) ? req.session.userInfo.user : 0
                });
            }
        } else {
            res.render('notFound', {
                user: (req.session.userInfo) ? req.session.userInfo.user : 0
            });
        }
    } catch (err){
        res.send("An error occurred")
    }
})

router.get('/:id/:com', async (req, res) => {
    try {

        /* This is similar to the /:id route, and is used for images that have several pages of comments (200 comments 
        per page). The :com is the page number of the comments section. */

        let verified = false;
        if (req.session){
            if (req.session.userInfo){
                if (req.session.userInfo.role === "Chadmin" || req.session.userInfo.role === "Verified" || req.session.userInfo.role === "Janny"){
                    verified = true;
                }
            }
        }
        if (isNum(req.params.id)){
            let result = await db.getImg(`select * from images where image_id = ${req.params.id}`);
            let nextResult = await db.getImg(`select image_id from images where image_id > ${req.params.id} and removed = 0 order by image_id asc limit 1`);
            let prevResult = await db.getImg(`select image_id from images where image_id < ${req.params.id} and removed = 0 order by image_id desc limit 1`);
            let access = false;
            if (result.length){
                if (req.session){
                    if (req.session.userInfo){
                        if (req.session.userInfo.role === 'Chadmin' || req.session.userInfo.role === 'Janny'){
                            access = true;
                        }
                    }
                }
                if (result[0].removed === 1 && access === false){
                    res.render('removed', {
                        user: (req.session.userInfo) ? req.session.userInfo.user : 0
                    });
                } else {
                    if (result[0].nsfw === 1){
                        if (req.session.nsfw === false || req.session.nsfw === undefined){
                            req.session.splash = req.originalUrl;
                            res.redirect('/nsfw');
                        } else {
                            const user = result[0].user;
                            const manifesto = (result[0].manifesto === "null" || result[0].manifesto_removed === 1) ? 0 : result[0].manifesto;
                            const imgId = result[0].image_id;
                            const previous = (prevResult.length === 0) ? 0 : prevResult[0].image_id;
                            const next = (nextResult.length === 0) ? 0 : nextResult[0].image_id;
                            if (isNum(req.params.com)){

                                /* Calculates the offset for the comments to be pulled from the database depending on 
                                the comment page number. */

                                let offset = (req.params.com * 200) - 200;
                                let sqlAll = `select * from comments where image_id = ${imgId} and removed = '0' limit 200 offset ${offset}`;
                                if (access === true){
                                    sqlAll = `select * from comments where image_id = ${imgId} limit 200 offset ${offset}`;
                                }
                                const commentsAll = await db.fetchComments(sqlAll);
                                const updateCountSql = `update images set views = views + 1 where image_id = ${req.params.id}`;
                                await db.getImg(updateCountSql);
                                let commentExcess = (result[0].comments > 200) ? true : false;
                                nextComments = (result[0].comments - offset - 200 > 0) ? Number(req.params.com) + 1 : null; 
                                res.render('image', {
                                    imgsrc: `https://img.nanaimg.net/img/${result[0].filename}`,
                                    direct_link: `https://img.nanaimg.net/img/${result[0].filename}`,
                                    imgnum: result[0].image_id,
                                    comments: commentsAll,
                                    commentNumber: result[0].comments,
                                    next: next,
                                    previous: previous,
                                    user: user,
                                    manifesto: manifesto,
                                    date: result[0].date,
                                    nsfw: result[0].nsfw,
                                    opid: (result[0].badge === "0") ? result[0].poster_id : 0,
                                    opColor: result[0].poster_css_color,
                                    loggedUser: (req.session.userInfo) ? req.session.userInfo.user : 0,
                                    opBadge: result[0].badge,
                                    badgeColor: (result[0].badge === "0") ? 0 : getBadgeColor(result[0].badge),
                                    commentsDisabled: result[0].comments_disabled,
                                    removed: result[0].removed,
                                    removedReason: result[0].removed_reason,
                                    manifestoRemoved: result[0].manifesto_removed,
                                    manifestoRemovedReason: result[0].manifesto_removed_reason,
                                    access: access,
                                    views: result[0].views + 1,
                                    commentExcess: commentExcess,
                                    previousComments: req.params.com - 1,
                                    nextComments: nextComments,
                                    commentPage: req.params.com,
                                    verified: verified
                                });
                            } else {
                                res.render('notFound', {
                                    user: (req.session.userInfo) ? req.session.userInfo.user : 0
                                });
                            }
                        }
                    } else {
                        const user = result[0].user;
                        const manifesto = (result[0].manifesto === "null" || result[0].manifesto_removed === 1) ? 0 : result[0].manifesto;
                        const imgId = result[0].image_id;
                        const previous = (prevResult.length === 0) ? 0 : prevResult[0].image_id;
                        const next = (nextResult.length === 0) ? 0 : nextResult[0].image_id;
                        if (isNum(req.params.com)){
                            let offset = (req.params.com * 200) - 200;
                            let sqlAll = `select * from comments where image_id = ${imgId} and removed = '0' limit 200 offset ${offset}`;
                            if (access === true){
                                sqlAll = `select * from comments where image_id = ${imgId} limit 200 offset ${offset}`;
                            }
                            const commentsAll = await db.fetchComments(sqlAll);
                            const updateCountSql = `update images set views = views + 1 where image_id = ${req.params.id}`;
                            await db.getImg(updateCountSql);
                            let commentExcess = (result[0].comments > 200) ? true : false;
                            nextComments = (result[0].comments - offset - 200 > 0) ? Number(req.params.com) + 1 : null; 
                            res.render('image', {
                                imgsrc: `https://img.nanaimg.net/img/${result[0].filename}`,
                                direct_link: `https://img.nanaimg.net/img/${result[0].filename}`,
                                imgnum: result[0].image_id,
                                comments: commentsAll,
                                commentNumber: result[0].comments,
                                next: next,
                                previous: previous,
                                user: user,
                                manifesto: manifesto,
                                date: result[0].date,
                                nsfw: result[0].nsfw,
                                opid: (result[0].badge === "0") ? result[0].poster_id : 0,
                                opColor: result[0].poster_css_color,
                                loggedUser: (req.session.userInfo) ? req.session.userInfo.user : 0,
                                opBadge: result[0].badge,
                                badgeColor: (result[0].badge === "0") ? 0 : getBadgeColor(result[0].badge),
                                commentsDisabled: result[0].comments_disabled,
                                removed: result[0].removed,
                                removedReason: result[0].removed_reason,
                                manifestoRemoved: result[0].manifesto_removed,
                                manifestoRemovedReason: result[0].manifesto_removed_reason,
                                access: access,
                                views: result[0].views + 1,
                                commentExcess: commentExcess,
                                previousComments: req.params.com - 1,
                                nextComments: nextComments,
                                commentPage: req.params.com,
                                verified: verified
                            });
                        } else {
                            res.render('notFound', {
                                user: (req.session.userInfo) ? req.session.userInfo.user : 0
                            });
                        }
                    }
                }
            } else {
                res.render('notFound', {
                    user: (req.session.userInfo) ? req.session.userInfo.user : 0
                });
            }
        } else {
            res.render('notFound', {
                user: (req.session.userInfo) ? req.session.userInfo.user : 0
            });
        }
    } catch (err){
        console.log(err);
        res.send("An error occurred")
    }
})



module.exports = router;