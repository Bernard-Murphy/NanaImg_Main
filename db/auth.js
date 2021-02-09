

/* This middleware will check the user session to see if the user is logged in and authorized to do things that 
verified users, admins, and/or moderators are allowed to do on the website. If the user is not logged in, he or 
she will be redirected to the login page. If they are logged in but banned or rejected, they will be redirected to 
their respective pages. If they are logged in and are either verified, a moderator, or an administrator, they will be 
sent on their way. */

function auth(req, res, next){
    if (req.session.userInfo){
        const userRole = req.session.userInfo.role;
        const user = req.session.userInfo.user;
        if (userRole === 'Chadmin' || userRole === 'Janny' || userRole === 'Verified'){
            next();
        } else if (userRole === 'applicant'){
            res.render('pending', {
                user: user
            });
        } else if (userRole === 'Banned'){
            res.render('banned', {
                user: user
            });
        } else if (userRole === 'rejected'){
            res.render('rejected', {
                user: user
            });
        } else {
            res.redirect('login');
        }
    } else {
        res.redirect('login');
    }
}

module.exports = auth;