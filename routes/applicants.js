const express = require('express');
const auth = require('../db/auth');
const router = express.Router();

// Determines whether the user is an administrator. If so, the user is served the "applicants" page with their credentials.
router.get('/', auth, (req, res) => {
    res.render('applicants', {
        user: (req.session.userInfo) ? req.session.userInfo.user : 0
    })
})

module.exports = router;