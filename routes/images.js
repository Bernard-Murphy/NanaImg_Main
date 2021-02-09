// This endpoint exists to redirect users who use nanaimg.net/images/:id instead of nanaimg.net/image/:id

const express = require('express');
const router = express.Router();

router.get('/:id', (req, res) => {
    try {
        res.redirect(`/image/${req.params.id}`)
    } catch (err){
        res.sendStatus(500);
    }
})

module.exports = router;