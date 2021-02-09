/* This middleware is present on any routes that have the potential for containing content that is inappropriate 
for people under the age of 18. It stores the user's intended route in the user session. Then, it checks to see if 
the user has previously acknowledged that they are over the age of 18 and are willing to be exposed to potentially 
inappropriate images. If true, then the user proceeds. If not, the user is redirected to the "NSFW" splash page and
asked to confirm their age. The req.session.splash is used so that when the user accepts the NSFW warning, the server
knows where to redirect the user. */

function nsfw(req, res, next){
    req.session.splash = req.originalUrl;
    if (req.session.nsfw){
        if (req.session.nsfw === true){
            next()
        } else {
            res.redirect('nsfw');
        }
    } else {
        res.redirect('nsfw');
    }
}

module.exports = nsfw;