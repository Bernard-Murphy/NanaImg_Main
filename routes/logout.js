const express = require('express');
const router = express.Router();


// Deletes the user's session upon logout.
router.get('/', (req, res) => {
    delete req.session.userInfo;
    res.redirect('login');
})

module.exports = router;