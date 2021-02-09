// This middleware determines whether the user is an administrator or a moderator, and returns a 401 unauthorized if not. It does this by checking the user's session. Used for routes in the report queue.

function reportAuth(req, res, next){
    if (req.session.userInfo){
        const userRole = req.session.userInfo.role;
        if (userRole === 'Chadmin' || userRole === 'Janny'){
            next();
        } else {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(401);
    }
}

module.exports = reportAuth;