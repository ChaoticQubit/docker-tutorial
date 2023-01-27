const protect = (req, res, next) => {
    if(req.session.user){
        req.user = req.session.user;
        next();
    }else{
        res.status(401).json({
            status: 'fail',
            message: 'You are not logged in'
        });
    }
}

module.exports = protect;