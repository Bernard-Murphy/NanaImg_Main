// This endpoint exists to redirect users who use nanaimg.net/comment/:id instead of nanaimg.net/comments/:id

const express = require('express');
const router = express.Router();

function isANumber(str) {
    return !isNaN(str) &&
            !isNaN(parseFloat(str)) 
}

router.get('/:id', (req, res) => {
    try {
        if (isANumber(req.params.id)){
            res.redirect(`/comments/${req.params.id}`)
        } else {
            res.render('notFound', {
                user: (req.session.userInfo) ? req.session.userInfo.user : 0
            });
        }
    } catch (err){
        res.sendStatus(500);
    }
})

module.exports = router;