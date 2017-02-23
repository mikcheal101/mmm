/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var passport 	= require('passport')
	LocalStrategy=require('passport-local').Strategy,
	moment      = require('moment');

module.exports 	= {
	register:function(req, res){
		var params	= req.params.all();
		try {
			// initially set 4 hours to add account
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
			if(err){
				return res.status(404).json({message:'database error', data:err});
			} else if(!user){
				return res.status(200).json({message:'User with username/password combination does not exist!', data:err});
			} else {
				req.logIn(user, function(aError){
					if(aError){
						return res.status(200).json({message:'User with username/password combination does not exist!', data:false, data:err});
					} else {
						if(user.userstatus === 'pending'){
							return res.status(200).json({message:'Please, check your email for your verification code. (Account pending verification!)', data:false});
						} else if(user.userstatus === 'suspended' || user.userstatus === 'paused'){
							return res.status(200).json({message:'Sorry!. Your account has been suspended!. Please, do contact the web administrator with your complaint (Account suspended!)', data:false});
						} else {
							var now         = moment(new Date());
				            user.timeLeft	= moment(user.timing).diff(now, 'seconds');
							User.findOne({id:user.id})
								.populate('account')
								.populate('userpackage')
								.then(function(bData){
									bData.timeLeft			= user.timeLeft;
									req.session.user		= bData;
									console.log('user found: ', bData);
									return res.status(200).json({message:'user registered!', data:bData});
								})
								.catch(function(bError){
									req.session.user	= user;
									console.log('error: ', bError);
									return res.status(200).json({message:'user registered!', data:false});
								});
						}
					}
				})
			}
		})(req, res);
	},
	logout:function(req, res, next){
		req.logOut();
		delete req.session.user;
		delete req.session.passport;

		res.status(200).redirect('/public/authentication/login');
	},
	signOut:function(req, res){
		console.log('logging out');
		req.logOut();
		delete req.session.user;
		delete req.session.passport;

		console.log('session: ', req.session);
		res.status(200).json({message: 'successfully logged Out!'});
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
				res.status(500);
				res.redirect('/');
			}
		});
	}
};
