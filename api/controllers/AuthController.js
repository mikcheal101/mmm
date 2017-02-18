/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var passport 	= require('passport'),
	moment      = require('moment');

module.exports 	= {
	register:function(req, res){
		var params	= req.params.all();
		try {
			User.save(params, function(err, user){
				if(!err) {
		            var now        		= moment(new Date());
		            user.timeLeft		= moment(user.timing).diff(now, 'seconds');
					User.findOne({id:user.id})
						.populate('account')
						.populate('userpackage')
						.then(function(d){

							req.session.user	= d;
							res.status(200).json({message:'user registered!', data:true});
						})
						.catch(function(e){
							req.session.user	= user;
							res.status(200).json({message:'user registered!', data:true});
						});

				} else {
					res.status(200).json({message:'username, email or mobile number is already associated with another user!', data:false});
				}
			});
		} catch(e){
			res.status(200).json({message:'username, email or mobile number is already associated with another user!', data:false});
		}
	},
	login:function(req, res){
		var params 	= req.params.all();

		passport.authenticate('local', function(err, user, info){
			if(err || !user){
				return res.status(200).json({message:'login failed', data:err});
			} else {
				req.logIn(user, function(err){
					if(err){
						return res.status(200).json({message:'login failed', data:false});
					} else {
						if(user.status === 'pending'){
							return res.status(200).json({message:'Please, check your email for your verification code. (Account pending verification!)', data:false});
						} else {
							var now         = moment(new Date());
				            user.timeLeft	= moment(user.timing).diff(now, 'seconds');
							User.findOne({id:user.id})
								.populate('account')
								.populate('userpackage')
								.then(function(d){
									req.session.user	= d;
									d.timeLeft			= user.timeLeft;
									res.status(200).json({message:'user registered!', data:true});
								})
								.catch(function(e){
									req.session.user	= user;
									res.status(200).json({message:'user registered!', data:true});
								});
						}
					}
				})
			}
		})(req, res);
	},
	logout:function(req, res, next){
		req.logOut();
		req.session.user 	={};
		res.status(200).redirect('/public/authentication/login');
	},
	confirm:function(req, res){
		var params 	= req.params.all();
		var result	= User.confirm(params);
		res.status(200).json(params);
	},
	session:function(req, res, next){
		res.status(200).json(req.session);
	},
	superAdmin:function(req, res, next){
		//create super admin if none exists
		User.superAdmin(function(err, data){
			if(!err){
				res.status(404);
				res.redirect('/public/authentication/login');
			} else {
				console.log(err);
				res.status(500);
				res.redirect('/');
			}
		});
	}
};
