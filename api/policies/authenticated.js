'use strict';

module.exports      = function(req, res, next){
    if(req.isAuthenticated()){
        //console.log('is authenticated');
        return next();
    } else {
        res.redirect('/');
        //return res.status(403).json({message:'Not Authorized!'});
    }
};
