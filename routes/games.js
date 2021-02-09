const express = require('express');
const auth = require('../db/auth');
const router = express.Router();

// For future use
router.get('/', auth, (req, res) => {
    try {
        res.render('games');
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
})

module.exports = router;