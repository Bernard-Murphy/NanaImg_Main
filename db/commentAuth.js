function auth(req, res, next){
    if (req.session.userInfo){
        const userRole = req.session.userInfo.role;
        const user = req.session.userInfo.user;
        if (userRole === 'Chadmin' || userRole === 'Janny' || userRole === 'Verified'){
            next();
        } else {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(401);
    }
}

module.exports = auth;