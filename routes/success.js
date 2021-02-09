// I'm pretty sure this isn't used anymore but I'm not 100% sure. Leaving it for now. 


const express = require('express');
const router = express.Router();

router.get('/:imgId/:comId', (req, res) => {
    res.redirect(`https://nanaimg.net/image/${req.params.imgId}#${req.params.comId}`);
})

module.exports = router;