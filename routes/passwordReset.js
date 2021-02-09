const express = require('express');
const router = express.Router();

// Serves the password reset page
router.get('/', (req, res) => {
    res.render('passwordReset');
})

module.exports = router;