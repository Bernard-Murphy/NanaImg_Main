/* This one is very long, I might split it up into separate routes in the future. It is responsible for serving all of 
the possible pages on the browse tab. This includes all the possible configurations one can choose in the "Sort by" 
options. All routes have the "nsfw" middleware. */


const express = require('express');
const router = express.Router();
const db = require('../db');
const getDate = require('../db/getDate');
const nsfw = require('../db/nsfw');

// Checks whether a string is a number. Used to prevent SQL injections.
function isANumber(str) {
    return !isNaN(str) &&
            !isNaN(parseFloat(str)) 
}

// Adds zero to the beginning of a number that is only one digit. Used to get some dates into the proper format.
function prependZero(num){
    if (num.length < 2){
        return "0" + num
    } else {
        return num
    }
    
}

router.get('/', nsfw, async (req, res) => {
    try {

        /* Serves the Browse page with the 49 most recent images. I do not have to sort by date because image ids are 
        chronological. */
        const sql = `select image_id, manifesto, user, filename, comments, thumbnail from images where removed = '0' order by image_id desc limit 49`;
        const imageList = await db.getImg(sql);
        const cardNumber = imageList.length;

        /* Creates an array of objects containing information about each image which will be looped through when the 
        page is rendered using Handlebars. */
        let imageData = imageList.map((image) => {
            let data = {}
            data.image_id = image.image_id;
            data.user = image.user;
            data.filename = image.filename;
            data.comments = image.comments;
            data.thumbnail = image.thumbnail;

            // If the image has a manifesto, up to the first 120 characters of it will be displayed below each image.
            if (image.manifesto !== "null"){
                data.manifesto = (image.manifesto.length > 120) ? image.manifesto.substr(0, 120) + "..." : image.manifesto;
            } else {
                data.manifesto = 0;
            }
            return data
        })
        res.render('browse', {
            cards: imageData,
            sort: "Latest Posts",
            page: 1,
            cardNumber: cardNumber,
            previous: 0,
            next: 2,
            baseUrl: `https://nanaimg.net/browse/recent`,
            offset: 1,
            units: "All Time",
            user: (req.session.userInfo) ? req.session.userInfo.user : 0
        });
    } catch (err) {
        res.sendStatus(500);
    }  
})

router.get('/recent-comments', nsfw, async (req, res) => {
    try {

        /* Every image has a column called "latest_comment". It is null for images without comments, but every time a 
        comment is posted on an image, this column is updated with the post number of the comment. Since comments are 
        also chronological, I can sort using this field */
        const sql = `select image_id, manifesto, user, filename, comments, thumbnail from images where removed = '0' order by latest_comment desc limit 49`;
        const imageList = await db.getImg(sql);
        const cardNumber = imageList.length;
        let imageData = imageList.map((image) => {
            let data = {}
            data.image_id = image.image_id;
            data.user = image.user;
            data.filename = image.filename;
            data.comments = image.comments;
            data.thumbnail = image.thumbnail;
            if (image.manifesto !== "null"){
                data.manifesto = (image.manifesto.length > 120) ? image.manifesto.substr(0, 120) + "..." : image.manifesto;
            } else {
                data.manifesto = 0;
            }
            return data
        })
        res.render('browse', {
            cards: imageData,
            sort: "Latest Comments",
            page: 1,
            cardNumber: cardNumber,
            previous: 0,
            next: 2,
            baseUrl: `https://nanaimg.net/browse/recent-comments`,
            offset: 1,
            units: "All Time",
            user: (req.session.userInfo) ? req.session.userInfo.user : 0
        });
    } catch (err) {
        res.sendStatus(500);
    }  
})

router.get('/recent-comments/:id', nsfw, async (req, res) => {
    try {

        /* The :id parameter here is the page number. This id is checked to make sure it is actually a number. If it 
        is not, the user will be redirected to the 404 page. If it is a number, we calculate the image offset using 
        the formula (:id - 1) * 49. */

        if (isANumber(req.params.id) === false){
            res.render('notFound', {
                user: (req.session.userInfo) ? req.session.userInfo.user : 0
            });
        } else {
            const offset = (req.params.id - 1) * 49;
            const sql = `select image_id, manifesto, user, filename, comments, thumbnail from images where removed = '0' order by latest_comment desc limit 49 offset ${offset}`;
            const imageList = await db.getImg(sql);
            const cardNumber = imageList.length;
            let imageData = imageList.map((image) => {
                let data = {}
                data.image_id = image.image_id;
                data.user = image.user;
                data.filename = image.filename;
                data.comments = image.comments;
                data.thumbnail = image.thumbnail;
                if (image.manifesto !== "null"){
                    data.manifesto = (image.manifesto.length > 120) ? image.manifesto.substr(0, 120) + "..." : image.manifesto;
                } else {
                    data.manifesto = 0;
                }
                return data
            })
            res.render('browse', {
                cards: imageData,
                sort: "Latest Comments",
                page: req.params.id,
                cardNumber: cardNumber,
                previous: Number(req.params.id) - 1,
                next: Number(req.params.id) + 1,
                baseUrl: `https://nanaimg.net/browse/recent-comments`,
                offset: 1,
                units: "All Time",
                user: (req.session.userInfo) ? req.session.userInfo.user : 0
            });
        }
    } catch (err){
        res.sendStatus(500);
    }
    
})

router.get('/recent', nsfw, async (req, res) => {
    try {

        // This endpoint is identical to the root endpoint.

        const sql = `select image_id, manifesto, user, filename, comments, thumbnail from images where removed = '0' order by image_id desc limit 49`;
        const imageList = await db.getImg(sql);
        const cardNumber = imageList.length;
        let imageData = imageList.map((image) => {
            let data = {}
            data.image_id = image.image_id;
            data.user = image.user;
            data.filename = image.filename;
            data.comments = image.comments;
            data.thumbnail = image.thumbnail;
            if (image.manifesto !== "null"){
                data.manifesto = (image.manifesto.length > 120) ? image.manifesto.substr(0, 120) + "..." : image.manifesto;
            } else {
                data.manifesto = 0;
            }
            return data
        })
        res.render('browse', {
            cards: imageData,
            sort: "Latest Posts",
            page: 1,
            cardNumber: cardNumber,
            previous: 0,
            next: 2,
            baseUrl: `https://nanaimg.net/browse/recent`,
            offset: 1,
            units: "All Time",
            user: (req.session.userInfo) ? req.session.userInfo.user : 0
        });
    } catch (err) {
        res.sendStatus(500);
    }
    
})

router.get('/recent/:id', nsfw, async (req, res) => {
    try {

        // This endpoint is identical to the /recent-comments endpoint, but with recent images.

        if (isANumber(req.params.id) === false){
            res.render('notFound', {
                user: (req.session.userInfo) ? req.session.userInfo.user : 0
            });
        } else {
            const offset = (req.params.id - 1) * 49;
            const sql = `select image_id, manifesto, user, filename, comments, thumbnail from images where removed = '0' order by image_id desc limit 49 offset ${offset}`;
            const imageList = await db.getImg(sql);
            const cardNumber = imageList.length;
            let imageData = imageList.map((image) => {
                let data = {}
                data.image_id = image.image_id;
                data.user = image.user;
                data.filename = image.filename;
                data.comments = image.comments;
                data.thumbnail = image.thumbnail;
                if (image.manifesto !== "null"){
                    data.manifesto = (image.manifesto.length > 120) ? image.manifesto.substr(0, 120) + "..." : image.manifesto;
                } else {
                    data.manifesto = 0;
                }
                return data
            })
            res.render('browse', {
                cards: imageData,
                sort: "Latest Posts",
                page: req.params.id,
                cardNumber: cardNumber,
                previous: Number(req.params.id) - 1,
                next: Number(req.params.id) + 1,
                baseUrl: `https://nanaimg.net/browse/recent`,
                offset: 1,
                units: "All Time",
                user: (req.session.userInfo) ? req.session.userInfo.user : 0
            });
        }
    } catch (err){
        res.sendStatus(500);
    }
    
})

router.get('/popular', nsfw, async (req, res) => {
    try {

        /* Each image has a column called "comments" which increments every time a comment is posted. This endpoint orders the images using this field. */

        const sql = `select image_id, manifesto, user, filename, comments, thumbnail from images where removed = '0' order by comments desc limit 49`;
        const imageList = await db.getImg(sql);
        const cardNumber = imageList.length;
        let imageData = imageList.map((image) => {
            let data = {}
            data.image_id = image.image_id;
            data.user = image.user;
            data.filename = image.filename;
            data.comments = image.comments;
            data.thumbnail = image.thumbnail;
            if (image.manifesto !== "null"){
                data.manifesto = (image.manifesto.length > 120) ? image.manifesto.substr(0, 120) + "..." : image.manifesto;
            } else {
                data.manifesto = 0;
            }
            return data
        })
        res.render('browse', {
            cards: imageData,
            sort: "Popular",
            page: 1,
            cardNumber: cardNumber,
            previous: 0,
            next: 2,
            baseUrl: `https://nanaimg.net/browse/popular`,
            offset: 1,
            units: "All Time",
            user: (req.session.userInfo) ? req.session.userInfo.user : 0
        });
    } catch (err) {
        res.sendStatus(500);
    }
    
})

router.get('/recent/:id', nsfw, async (req, res) => {
    try {

        // This endpoint is the same as the /recent-comments/:id endpoint, except images are ordered by image_id

        if (isANumber(req.params.id) === false){
            res.render('notFound', {
                user: (req.session.userInfo) ? req.session.userInfo.user : 0
            });
        } else {
            const offset = (req.params.id - 1) * 49;
            const sql = `select image_id, manifesto, user, filename, comments, thumbnail from images where removed = '0' order by image_id desc limit 49 offset ${offset}`;
            const imageList = await db.getImg(sql);
            const cardNumber = imageList.length;
            let imageData = imageList.map((image) => {
                let data = {}
                data.image_id = image.image_id;
                data.user = image.user;
                data.filename = image.filename;
                data.comments = image.comments;
                data.thumbnail = image.thumbnail;
                if (image.manifesto !== "null"){
                    data.manifesto = (image.manifesto.length > 120) ? image.manifesto.substr(0, 120) + "..." : image.manifesto;
                } else {
                    data.manifesto = 0;
                }
                return data
            })
            res.render('browse', {
                cards: imageData,
                sort: "Latest Posts",
                page: req.params.id,
                cardNumber: cardNumber,
                previous: Number(req.params.id) - 1,
                next: Number(req.params.id) + 1,
                baseUrl: `https://nanaimg.net/browse/recent`,
                offset: 1,
                units: "All Time",
                user: (req.session.userInfo) ? req.session.userInfo.user : 0
            });
        }
    } catch (err){
        res.sendStatus(500);
    }
    
})

router.get('/popular/week', nsfw, async (req, res) => {
    try {

        /* This endpoint is currently broken. The idea was to find the most commented on images in the last 7 days, though it doesn't take into account the fact situations where last week would be in a different month. */

        var date = new Date();
        date.setDate(date.getDate()-(1 * 7) + 7);
        let today = date.toString().split(' ')[2];
        let year = date.toString().split(' ')[3];
        let month = date.toISOString().split('-')[1];
        let lastWeek = today - 7;
        while (lastWeek < 1){
            lastWeek += 30
            month -= 1;
        }
        while (month < 1){
            month += 12
            year -= 1;
        }
        lastWeek = lastWeek.toString();
        month = month.toString();
        year = year.toString();
        today = prependZero(today);
        lastWeek = prependZero(lastWeek);
        month = prependZero(month);
        let sql = '';
        if (today > lastWeek){
            sql = `select image_id, manifesto, user, filename, comments, thumbnail from images where removed = '0' and img_year = '${year}' and img_month = '${month}' and img_day between '${lastWeek}' and '${today}' order by comments desc limit 49`;
        } else {
            sql = `select image_id, manifesto, user, filename, comments, thumbnail from images where removed = '0' and img_year = '${year}' and img_month = '${month}' and img_day between '${today}' and '${lastWeek}' order by comments desc limit 49`;
        }        
        const imageList = await db.getImg(sql);
        const cardNumber = imageList.length;
        let imageData = imageList.map((image) => {
            let data = {}
            data.image_id = image.image_id;
            data.user = image.user;
            data.filename = image.filename;
            data.comments = image.comments;
            data.thumbnail = image.thumbnail;
            if (image.manifesto !== "null"){
                data.manifesto = (image.manifesto.length > 120) ? image.manifesto.substr(0, 120) + "..." : image.manifesto;
            } else {
                data.manifesto = 0;
            }
            return data
        })
        res.render('browse', {
            cards: imageData,
            sort: "Popular",
            page: 1,
            cardNumber: cardNumber,
            previous: 0,
            next: 2,
            baseUrl: `https://nanaimg.net/browse/popular/week`,
            offset: 1,
            units: "week",
            user: (req.session.userInfo) ? req.session.userInfo.user : 0
        });
    } catch (err){
        res.sendStatus(500);
    }
})

router.get('/popular/day', nsfw, async (req, res) => {
    try {

        /* Determines the current day, month, and year, then finds images matching these values and sorts them by the number of comments.  */

        var date = new Date();
        date.setDate(date.getDate());
        let day = date.toString().split(' ')[2];
        let year = date.toString().split(' ')[3];
        let month = date.toISOString().split('-')[1];
        month = prependZero(month);
        day = prependZero(day);
        const sql = `select image_id, manifesto, user, filename, comments, thumbnail from images where removed = '0' and img_year = '${year}' and img_month = '${month}' and img_day = '${day}' order by comments desc limit 49`;
        const imageList = await db.getImg(sql);
        const cardNumber = imageList.length;
        let imageData = imageList.map((image) => {
            let data = {}
            data.image_id = image.image_id;
            data.user = image.user;
            data.filename = image.filename;
            data.comments = image.comments;
            data.thumbnail = image.thumbnail;
            if (image.manifesto !== "null"){
                data.manifesto = (image.manifesto.length > 120) ? image.manifesto.substr(0, 120) + "..." : image.manifesto;
            } else {
                data.manifesto = 0;
            }
            return data
        })
        res.render('browse', {
            cards: imageData,
            sort: "Popular",
            page: 1,
            cardNumber: cardNumber,
            previous: 0,
            next: 2,
            baseUrl: `https://nanaimg.net/browse/popular/day`,
            offset: 1,
            units: "day",
            user: (req.session.userInfo) ? req.session.userInfo.user : 0
        });
    } catch (err){
        res.sendStatus(500);
    }
})

router.get('/popular/month', nsfw, async (req, res) => {
    try {

        // Determines the current month and year, then finds matching images them and sorts them by number of comments.

        const date = getDate();
        const year = date.year;
        let month = date.month;
        month = prependZero(month);
        const sql = `select image_id, manifesto, user, filename, comments, thumbnail from images where removed = '0' and img_year = ${year} and img_month = ${month} order by comments desc limit 49`;
        const imageList = await db.getImg(sql);
        const cardNumber = imageList.length;
        let imageData = imageList.map((image) => {
            let data = {}
            data.image_id = image.image_id;
            data.user = image.user;
            data.filename = image.filename;
            data.comments = image.comments;
            data.thumbnail = image.thumbnail;
            if (image.manifesto !== "null"){
                data.manifesto = (image.manifesto.length > 120) ? image.manifesto.substr(0, 120) + "..." : image.manifesto;
            } else {
                data.manifesto = 0;
            }
            return data
        })
        res.render('browse', {
            cards: imageData,
            sort: "Popular",
            page: 1,
            cardNumber: cardNumber,
            previous: 0,
            next: 2,
            baseUrl: `https://nanaimg.net/browse/popular/month`,
            offset: 1,
            units: "month",
            user: (req.session.userInfo) ? req.session.userInfo.user : 0
        });
    } catch (err){
        res.sendStatus(500);
    }
})

router.get('/popular/year', nsfw, async (req, res) => {
    try {

        /* Determines the current year, then finds the 49 most commented on images from this year (so, not necessarily 
            from the last 365 days) */
        const year = getDate().year;
        const sql = `select image_id, manifesto, user, filename, comments, thumbnail from images where removed = '0' and img_year = ${year} order by comments desc limit 49`;
        const imageList = await db.getImg(sql);
        const cardNumber = imageList.length;
        let imageData = imageList.map((image) => {
            let data = {}
            data.image_id = image.image_id;
            data.user = image.user;
            data.filename = image.filename;
            data.comments = image.comments;
            data.thumbnail = image.thumbnail;
            if (image.manifesto !== "null"){
                data.manifesto = (image.manifesto.length > 120) ? image.manifesto.substr(0, 120) + "..." : image.manifesto;
            } else {
                data.manifesto = 0;
            }
            return data
        })
        res.render('browse', {
            cards: imageData,
            sort: "Popular",
            page: 1,
            cardNumber: cardNumber,
            previous: 0,
            next: 2,
            baseUrl: `https://nanaimg.net/browse/popular/year`,
            offset: 1,
            units: "year",
            user: (req.session.userInfo) ? req.session.userInfo.user : 0
        });
    } catch (err){
        res.sendStatus(500);
    }
})

router.get('/popular/:id', nsfw, async (req, res) => {
    try {

        // This endpoint is identical to the /recent/:id endpoint, except images are sorted by comments

        if (isANumber(req.params.id) === false){
            res.render('notFound', {
                user: (req.session.userInfo) ? req.session.userInfo.user : 0
            });
        } else {
            const offset = (req.params.id - 1) * 49;
            const sql = `select image_id, manifesto, user, filename, comments, thumbnail from images where removed = '0' order by comments desc limit 49 offset ${offset}`;
            const imageList = await db.getImg(sql);
            const cardNumber = imageList.length;
            let imageData = imageList.map((image) => {
                let data = {}
                data.image_id = image.image_id;
                data.user = image.user;
                data.filename = image.filename;
                data.comments = image.comments;
                data.thumbnail = image.thumbnail;
                if (image.manifesto !== "null"){
                    data.manifesto = (image.manifesto.length > 120) ? image.manifesto.substr(0, 120) + "..." : image.manifesto;
                } else {
                    data.manifesto = 0;
                }
                return data
            })
            res.render('browse', {
                cards: imageData,
                sort: "Popular",
                page: req.params.id,
                cardNumber: cardNumber,
                previous: Number(req.params.id) - 1,
                next: Number(req.params.id) + 1,
                baseUrl: `https://nanaimg.net/browse/popular`,
                offset: 1,
                units: "All Time",
                user: (req.session.userInfo) ? req.session.userInfo.user : 0
            });
        }
    } catch (err){
        res.sendStatus(500);
    }
})

router.get('/popular/year/:off/:id', nsfw, async (req, res) => {
    try {

        /* The :off parameter is the number of years we are going back, while the :id parameter is the page number 
        from the images in this year. Both parameters are determined to be numbers, then the desired year is 
        determined, the desired offset is determined, and the images are pulled from the database and sorted by number 
        of comments. */

        if (isANumber(req.params.id) === false || isANumber(req.params.off) === false){
            res.render('notFound', {
                user: (req.session.userInfo) ? req.session.userInfo.user : 0
            });
        } else {
            const year = getDate().year - req.params.off + 1;
            const offset = (req.params.id - 1) * 49;
            const sql = `select image_id, manifesto, user, filename, comments, thumbnail from images where removed = '0' and img_year = ${year} order by comments desc limit 49 offset ${offset}`;
            const imageList = await db.getImg(sql);
            const cardNumber = imageList.length;
            let imageData = imageList.map((image) => {
                let data = {}
                data.image_id = image.image_id;
                data.user = image.user;
                data.filename = image.filename;
                data.comments = image.comments;
                data.thumbnail = image.thumbnail;
                if (image.manifesto !== "null"){
                    data.manifesto = (image.manifesto.length > 120) ? image.manifesto.substr(0, 120) + "..." : image.manifesto;
                } else {
                    data.manifesto = 0;
                }
                return data
            })
            res.render('browse', {
                cards: imageData,
                sort: "Popular",
                page: req.params.id,
                cardNumber: cardNumber,
                previous: Number(req.params.id) - 1,
                next: Number(req.params.id) + 1,
                baseUrl: `https://nanaimg.net/browse/popular/year/${req.params.off}`,
                offset: req.params.off,
                units: "year",
                user: (req.session.userInfo) ? req.session.userInfo.user : 0
            });
        }
    } catch (err){
        res.sendStatus(500);
    }
})

router.get('/popular/year/:id', nsfw, async (req, res) => {
    try {

        // This endpoint functions the same as /popular/year/:off/:id, but assumes :off is equal to zero

        if (isANumber(req.params.id) === false){
            res.render('notFound', {
                user: (req.session.userInfo) ? req.session.userInfo.user : 0
            });
        } else {
            const year = getDate().year;
            const offset = (req.params.id - 1) * 49;
            const sql = `select image_id, manifesto, user, filename, comments, thumbnail from images where removed = '0' and img_year = ${year} order by comments desc limit 49 offset ${offset}`;
            const imageList = await db.getImg(sql);
            const cardNumber = imageList.length;
            let imageData = imageList.map((image) => {
                let data = {}
                data.image_id = image.image_id;
                data.user = image.user;
                data.filename = image.filename;
                data.comments = image.comments;
                data.thumbnail = image.thumbnail;
                if (image.manifesto !== "null"){
                    data.manifesto = (image.manifesto.length > 120) ? image.manifesto.substr(0, 120) + "..." : image.manifesto;
                } else {
                    data.manifesto = 0;
                }
                return data
            })
            res.render('browse', {
                cards: imageData,
                sort: "Popular",
                page: req.params.id,
                cardNumber: cardNumber,
                previous: Number(req.params.id) - 1,
                next: Number(req.params.id) + 1,
                baseUrl: `https://nanaimg.net/browse/popular/year`,
                offset: 1,
                units: "year",
                user: (req.session.userInfo) ? req.session.userInfo.user : 0
            });
        }
    } catch (err){
        res.sendStatus(500);
    }
})

router.get('/popular/month/:off/:id', nsfw, async (req, res) => {
    try {

        /* :off is used to determine how many months back the user would like to go. It does this by determining the 
        current month and year, then subtracting the offset from the month. While the month is less than one, the 
        current year is subtracted by one and 12 is added to the month. Once we have a valid month and year, images 
        matching these are grabbed from the database offset by the :off parameter. They are sorted by the number of 
        comments. */

        if (isANumber(req.params.id) === false || isANumber(req.params.off) === false){
            res.render('notFound', {
                user: (req.session.userInfo) ? req.session.userInfo.user : 0
            });
        } else {
            const date = getDate();
            let year = date.year;
            let month = date.month - req.params.off + 1;
            if (month < 1){
                while (month < 1){
                    month += 12;
                    year -= 1;
                }
            }
            month = prependZero(month);
            const offset = (req.params.id - 1) * 49;
            const sql = `select image_id, manifesto, user, filename, comments, thumbnail from images where removed = '0' and img_year = ${year} and img_month = ${month} order by comments desc limit 49 offset ${offset}`;
            const imageList = await db.getImg(sql);
            const cardNumber = imageList.length;
            let imageData = imageList.map((image) => {
                let data = {}
                data.image_id = image.image_id;
                data.user = image.user;
                data.filename = image.filename;
                data.comments = image.comments;
                data.thumbnail = image.thumbnail;
                if (image.manifesto !== "null"){
                    data.manifesto = (image.manifesto.length > 120) ? image.manifesto.substr(0, 120) + "..." : image.manifesto;
                } else {
                    data.manifesto = 0;
                }
                return data
            })
            res.render('browse', {
                cards: imageData,
                sort: "Popular",
                page: req.params.id,
                cardNumber: cardNumber,
                previous: Number(req.params.id) - 1,
                next: Number(req.params.id) + 1,
                baseUrl: `https://nanaimg.net/browse/popular/month/${req.params.off}`,
                offset: req.params.off,
                units: "month",
                user: (req.session.userInfo) ? req.session.userInfo.user : 0
            });
        }
    } catch (err){
        console.log(err);
        res.sendStatus(500);
    }
})

router.get('/popular/month/:id', nsfw, async (req, res) => {
    try {

        // Functions the same as /popular/month/:off/:id, but assumes :off is zero

        if (isANumber(req.params.id) === false){
            res.render('notFound', {
                user: (req.session.userInfo) ? req.session.userInfo.user : 0
            });
        } else {
            const date = getDate();
            const year = date.year;
            let month = date.month;
            month = prependZero(month);
            const offset = (req.params.id - 1) * 49;
            const sql = `select image_id, manifesto, user, filename, comments, thumbnail from images where removed = '0' and img_year = ${year} and img_month = ${month} order by comments desc limit 49 offset ${offset}`;
            const imageList = await db.getImg(sql);
            const cardNumber = imageList.length;
            let imageData = imageList.map((image) => {
                let data = {}
                data.image_id = image.image_id;
                data.user = image.user;
                data.filename = image.filename;
                data.comments = image.comments;
                data.thumbnail = image.thumbnail;
                if (image.manifesto !== "null"){
                    data.manifesto = (image.manifesto.length > 120) ? image.manifesto.substr(0, 120) + "..." : image.manifesto;
                } else {
                    data.manifesto = 0;
                }
                return data
            })
            res.render('browse', {
                cards: imageData,
                sort: "Popular",
                page: req.params.id,
                cardNumber: cardNumber,
                previous: Number(req.params.id) - 1,
                next: Number(req.params.id) + 1,
                baseUrl: `https://nanaimg.net/browse/popular/month`,
                offset: 1,
                units: "month",
                user: (req.session.userInfo) ? req.session.userInfo.user : 0
            });
        }
    } catch (err){
        res.sendStatus(500);
    }
})

router.get('/popular/day/:off/:id', nsfw, async (req, res) => {
    try {

        /* Determines the desired day by using the built-in setDate function and simply subtracting the days. The :id 
        of course is the page number */

        if (isANumber(req.params.id) === false || isANumber(req.params.off) === false){
            res.render('notFound', {
                user: (req.session.userInfo) ? req.session.userInfo.user : 0
            });
        } else {
            var date = new Date();
            date.setDate(date.getDate()-req.params.off + 1);
            let day = date.toString().split(' ')[2];
            let year = date.toString().split(' ')[3];
            let month = date.toISOString().split('-')[1];
            const offset = (req.params.id - 1) * 49;
            month = prependZero(month);
            day = prependZero(day);
            const sql = `select image_id, manifesto, user, filename, comments, thumbnail from images where removed = '0' and img_year = ${year} and img_month = ${month} and img_day = ${day} order by comments desc limit 49 offset ${offset}`;
            const imageList = await db.getImg(sql);
            const cardNumber = imageList.length;
            let imageData = imageList.map((image) => {
                let data = {}
                data.image_id = image.image_id;
                data.user = image.user;
                data.filename = image.filename;
                data.comments = image.comments;
                data.thumbnail = image.thumbnail;
                if (image.manifesto !== "null"){
                    data.manifesto = (image.manifesto.length > 120) ? image.manifesto.substr(0, 120) + "..." : image.manifesto;
                } else {
                    data.manifesto = 0;
                }
                return data
            })
            res.render('browse', {
                cards: imageData,
                sort: "Popular",
                page: req.params.id,
                cardNumber: cardNumber,
                previous: Number(req.params.id) - 1,
                next: Number(req.params.id) + 1,
                baseUrl: `https://nanaimg.net/browse/popular/day/${req.params.off}`,
                offset: req.params.off,
                units: "day",
                user: (req.session.userInfo) ? req.session.userInfo.user : 0
            });
        }
    } catch (err){
        res.sendStatus(500);
    }
})

router.get('/popular/day/:id', nsfw, async (req, res) => {
    try {

        // Functions the same as /popular/month/:id, but with days instead.

        if (isANumber(req.params.id) === false){
            res.render('notFound', {
                user: (req.session.userInfo) ? req.session.userInfo.user : 0
            });
        } else {
            var date = new Date();
            date.setDate(date.getDate());
            let day = date.toString().split(' ')[2];
            let year = date.toString().split(' ')[3];
            let month = date.toISOString().split('-')[1];
            const offset = (req.params.id - 1) * 49;
            month = prependZero(month);
            day = prependZero(day);
            const sql = `select image_id, manifesto, user, filename, comments, thumbnail from images where removed = '0' and img_year = ${year} and img_month = ${month} and img_day = ${day} order by comments desc limit 49 offset ${offset}`;
            const imageList = await db.getImg(sql);
            const cardNumber = imageList.length;
            let imageData = imageList.map((image) => {
                let data = {}
                data.image_id = image.image_id;
                data.user = image.user;
                data.filename = image.filename;
                data.comments = image.comments;
                data.thumbnail = image.thumbnail;
                if (image.manifesto !== "null"){
                    data.manifesto = (image.manifesto.length > 120) ? image.manifesto.substr(0, 120) + "..." : image.manifesto;
                } else {
                    data.manifesto = 0;
                }
                return data
            })
            res.render('browse', {
                cards: imageData,
                sort: "Popular",
                page: req.params.id,
                cardNumber: cardNumber,
                previous: Number(req.params.id) - 1,
                next: Number(req.params.id) + 1,
                baseUrl: `https://nanaimg.net/browse/popular/day`,
                offset: 1,
                units: "day",
                user: (req.session.userInfo) ? req.session.userInfo.user : 0
            });
        }
    } catch (err){
        res.sendStatus(500);
    }
})

router.get('/popular/week/:off/:id', nsfw, async (req, res) => {
    try {

        // Currently broken for the same reason the other week endpoints are broken.

        if (isANumber(req.params.id) === false || isANumber(req.params.off) === false){
            res.render('notFound', {
                user: (req.session.userInfo) ? req.session.userInfo.user : 0
            });
        } else {
            var date = new Date();
            date.setDate(date.getDate()-(req.params.off * 7) + 7);
            let today = date.toString().split(' ')[2];
            let year = date.toString().split(' ')[3];
            let month = date.toISOString().split('-')[1];
            let lastWeek = today - 7;
            while (lastWeek < 1){
                lastWeek += 30;
                month -= 1;  
            }
            while (month < 1){
                month += 12
                year += 1;
            }
            lastWeek = lastWeek.toString();
            month = month.toString();
            year = year.toString();
            month = prependZero(month);
            today = prependZero(today);
            lastWeek = prependZero(lastWeek);
            const offset = (req.params.id - 1) * 49;
            let sql = '';
            if (today > lastWeek){
                sql = `select image_id, manifesto, user, filename, comments, thumbnail from images where removed = '0' and img_year = '${year}' and img_month = '${month}' and img_day between '${lastWeek}' and '${today}' order by comments desc limit 49 offset ${offset}`;
            } else {
                sql = `select image_id, manifesto, user, filename, comments, thumbnail from images where removed = '0' and img_year = ${year} and img_month = ${month} and img_day between ${today} and ${lastWeek} order by comments desc limit 49 offset ${offset}`;
            }        
            const imageList = await db.getImg(sql);
            const cardNumber = imageList.length;
            let imageData = imageList.map((image) => {
                let data = {}
                data.image_id = image.image_id;
                data.user = image.user;
                data.filename = image.filename;
                data.comments = image.comments;
                data.thumbnail = image.thumbnail;
                if (image.manifesto !== "null"){
                    data.manifesto = (image.manifesto.length > 120) ? image.manifesto.substr(0, 120) + "..." : image.manifesto;
                } else {
                    data.manifesto = 0;
                }
                return data
            })
            res.render('browse', {
                cards: imageData,
                sort: "Popular",
                page: req.params.id,
                cardNumber: cardNumber,
                previous: Number(req.params.id) - 1,
                next: Number(req.params.id) + 1,
                baseUrl: `https://nanaimg.net/browse/popular/week/${req.params.off}`,
                offset: req.params.off,
                units: "week",
                user: (req.session.userInfo) ? req.session.userInfo.user : 0
            });
        }
    } catch (err){
        console.log(err);
        res.sendStatus(500);
    }
})

router.get('/popular/week/:id', nsfw, async (req, res) => {
    try {

        // Currently broken for the same reason the other week endpoints are broken

        if (isANumber(req.params.id) === false){
            res.render('notFound', {
                user: (req.session.userInfo) ? req.session.userInfo.user : 0
            });
        } else {
            var date = new Date();
            date.setDate(date.getDate()-(1 * 7) + 7);
            let today = date.toString().split(' ')[2];
            let year = date.toString().split(' ')[3];
            let month = date.toISOString().split('-')[1];
            let lastWeek = today - 7;
            while (lastWeek < 1){
                lastWeek += 30
                month -= 1;
            }
            while (month < 1){
                month += 12;
                year -= 1;
            }
            month = month.toString();
            lastWeek = lastWeek.toString();
            year = year.toString();
            month = prependZero(month);
            today = prependZero(today);
            lastWeek = prependZero(lastWeek);
            const offset = (req.params.id - 1) * 49;
            let sql = '';
            if (today > lastWeek){
                sql = `select image_id, manifesto, user, filename, comments, thumbnail from images where removed = '0' and year = ${year} and img_month = ${month} and img_day between ${lastWeek} and ${today} order by comments desc limit 49 offset ${offset}`;
            } else {
                sql = `select image_id, manifesto, user, filename, comments from images where removed = '0' and year = ${year} and img_month = ${month} and img_day between ${today} and ${lastWeek} order by comments desc limit 49 offset ${offset}`;
            }        
            const imageList = await db.getImg(sql);
            const cardNumber = imageList.length;
            let imageData = imageList.map((image) => {
                let data = {}
                data.image_id = image.image_id;
                data.user = image.user;
                data.filename = image.filename;
                data.comments = image.comments;
                data.thumbnail = image.thumbnail;
                if (image.manifesto !== "null"){
                    data.manifesto = (image.manifesto.length > 120) ? image.manifesto.substr(0, 120) + "..." : image.manifesto;
                } else {
                    data.manifesto = 0;
                }
                return data
            })
            res.render('browse', {
                cards: imageData,
                sort: "Popular",
                page: req.params.id,
                cardNumber: cardNumber,
                previous: Number(req.params.id) - 1,
                next: Number(req.params.id) + 1,
                baseUrl: `https://nanaimg.net/browse/popular/week`,
                offset: 1,
                units: "week",
                user: (req.session.userInfo) ? req.session.userInfo.user : 0
            });
        }
    } catch (err){
        res.sendStatus(500);
    }
})



module.exports = router;