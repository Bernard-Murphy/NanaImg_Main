const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const exphbs = require('express-handlebars');
const dotenv = require('dotenv');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const db = require('./db');
const router = require('./router');
const util = require('util');
const getDate = require('./db/getDate');
const MySQLStore = require('express-mysql-session')(session);
const getId = require('./db/getId');
const pickColor = require('./db/pickColor');
const imagemin = require('imagemin');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageSize = require('image-size');
const sharp = require('sharp');
const http = require('http');
const https = require('https');
const fs = require('fs');
const axios = require('axios');


const customHb = exphbs.create({
    defaultLayout: 'main',
    helpers: {
        custIf: function(cn){
            if (cn === 0){
                return "You have reached the end"
            }
        },
        spaceOpBadgeUp: function(badge){
            if (badge === 'https://nanaimg.net/assets/chadminmel.png'){
                return '0'
            } else if (badge === 'https://nanaimg.net/assets/spaceedge.png'){
                return '0'
            } else if (badge === 'https://nanaimg.net/assets/verifiedbadge.png'){
                return '0'
            }
        },
        spaceOpBadgeSide: function(badge){
            if (badge === 'https://nanaimg.net/assets/chadminmel.png'){
                return 'post-chadmin-mel-space'
            } else if (badge === 'https://nanaimg.net/assets/spaceedge.png'){
                return 'post-spaceedge-space'
            } else if (badge === 'https://nanaimg.net/assets/verifiedbadge.png') {
                return 'post-verified-space'
            }
        },
        spaceComBadgeUp: function(badge){
            if (badge === 'https://nanaimg.net/assets/chadminmel.png'){
                return '0'
            } else if (badge === 'https://nanaimg.net/assets/spaceedge.png'){
                return '0'
            } else if (badge === 'https://nanaimg.net/assets/verifiedbadge.png'){
                return '0'
            }
        },
        getBadgeContWidth: function(badge){
            if (badge === 'https://nanaimg.net/assets/chadminmel.png'){
                return 'comment-chadmin-mel-space'
            } else if (badge === 'https://nanaimg.net/assets/spaceedge.png'){
                return 'comment-spaceedge-space'
            } else if (badge === 'https://nanaimg.net/assets/verifiedbadge.png'){
                return 'comment-verified-space'
            }
        },
        getBadgeColor: function(badge){
            if (badge === 'https://nanaimg.net/assets/chadminmel.png'){
                return 'rgb(255, 201, 14)'
            } else if (badge === 'https://nanaimg.net/assets/spaceedge.png'){
                return 'rgb(26, 132, 57)'
            } else if (badge === 'https://nanaimg.net/assets/verifiedbadge.png'){
                return 'rgb(0, 138, 198)'
            } else {
                return "black"
            }
        },
        ifEquals: function(one, two, options){
            return (one === two) ? options.fn(this) : options.inverse(this);
        },
        ifNotEquals: function(one, two, options){
            return (one !== two) ? options.fn(this) : options.inverse(this);
        }
    }
})

const server = express();
dotenv.config();
const PORT = process.env.PORT;
server.use(bodyParser.json());
server.use(cors())
server.use(express.static(path.join(__dirname, '/public')));
server.set('views', path.join(__dirname, 'views'));
server.engine('handlebars', customHb.engine),
server.set('view engine', 'handlebars');
server.use(fileUpload());

const sessionConfig = {
    name: process.env.SESS_NAME,
    secret: process.env.SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365,
        secure: false,
        httpOnly: false
    },
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        port: 3306,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE
    })
}



server.use(session(sessionConfig));
// server.use(function(req, res, next){
//     console.log(req.port);
//     next();
// })
server.use('/', router);

server.post('/upload', async (req, res) => {
    try {
        let username = (req.body.name.length > 0) ? req.body.name : "Anonymous";
        let uid = '';
        let userId = '';
        if (req.session.userInfo){
            if (req.session.userInfo.user){
                if (req.session.userInfo.badge !== null && req.session.userInfo.badge !== '0'){
                    username = req.session.userInfo.user;
                }
            }
            if (req.session.userInfo.role === "Verified" || req.session.userInfo.role === "Janny" || req.session.userInfo.role === "Chadmin"){
                getVerifiedId = await db.getImg(`select uuid from users where user_id = '${req.session.userInfo.id}'`);
                uid = getVerifiedId[0].uuid;
                userId = req.session.userInfo.id;
            }
        }
        const nsfw = (req.body.nsfw === 'true') ? 1 : 0;
        if (nsfw === 1){
            req.session.nsfw = true;
        }
        if (req.session.postId === undefined){
            req.session.postId = getId();
        }
        if (req.session.postColor === undefined){
            req.session.postColor = pickColor();
        }
        let badge = 0;
        if (req.session.userInfo){
            if (req.session.userInfo.badge){
                badge = req.session.userInfo.badge;
            }
        }
        if (username.split("\\").length > 1){
            username = username.split("\\").join('');
        }
        if (username.split("'").length > 1){
            let splitText = username.split("'")
            for (let i = 1; i < splitText.length; i++){
                splitText[i] = "\\'" + splitText[i];
            }
            username = splitText.join('');
        }
        res.send({
            author: {
                username: username,
                postId: req.session.postId,
                postColor: req.session.postColor,
                badge: badge,
                uid: uid,
                userId: userId
            }
        })
    } catch(err){
        console.log(err);
        res.send({
            error: err
        })
    }
})




server.use(function(req, res){
    res.status(404).render('notFound', {
        user: (req.session.userInfo) ? req.session.userInfo.user : 0
    });
})

const httpServer = http.createServer(server);
const httpsServer = https.createServer(server);

httpServer.listen(1000, () => {
    console.log(`feeding nana on port 1000`);
})

httpsServer.listen(2000, () => {
    console.log('feeding nana securely on port 2000');
})