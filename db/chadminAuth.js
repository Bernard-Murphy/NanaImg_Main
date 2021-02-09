// This middleware package is used in routes where the user must be a site administrator. It does this by checking the user's session cookie.

function chadminAuth(req, res, next){
    if (req.session.userInfo){
        const userRole = req.session.userInfo.role;
        if (userRole === 'Chadmin'){
            next();
        } else {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(401);
    }
}

module.exports = chadminAuth;