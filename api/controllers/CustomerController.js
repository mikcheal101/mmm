/**
 * CustomerController
 *
 * @description :: Server-side logic for managing Customers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const path 		= require('path');
module.exports 	= {
	resetTiming:function(req, res){
		var params 			= req.params.all();
		User.resetTiming(params, (aError, aData) => {
			if(aError) res.status(400).json();
			else if(!aData) res.status(404).json({});
			else res.status(200).json(aData);
		});
	},
	getMatch:function(req, res){
		var params 			= req.params.all();
		params.userpackage 	= req.session.user.userpackage;
		params.account 		= req.session.user.account;
		params.id 			= req.session.user.id;
		User.getMatch(params, (aError, aData) => {
			if(aError)
				res.status(404).json(aData);
			else if
				(!aData) res.status(200).json({});
			else {
				req.session.user.timing = aData.timing;
				res.status(200).json(aData);
			}
		});
	},
	matchme:function(req, res){
		var params 		= req.params.all();
		User.setMatch(params, (aError, aData) => {
			if(aError) res.status(400).json(aError);
			else if(!aData) res.status(404).json({});
			else res.status(200).json(aData);
		});
	},
	getToPay:function(req, res){
		var params 		= req.params.all();
		var now = new Date();
        var late= new Date();
        late.setHours(late.getHours() + 1);

		User
		.findOne({id:params.matchedToPay})
		.populate('account')
        .populate('userpackage')
        .populate('matchedToPay')
        .populate('matchedToBePaidBy')
		.then(aData => {
			Account
				.findOne({id:aData.account.id})
				.populate('bank')
				.then(bData => {
					aData.account = bData;
					console.log('aData Banks: ', aData);
					res.status(200).json(aData);
				})
				.catch(bError => {
					console.log(' : ', bError);
					res.status(400).json(bError);
				});
		})
		.catch(aError => {
			res.status(400).json(aError);
		});
	},
	makePayment:function(req, res){
		var params  	= req.params.all();
		User.makePayment(params, (aError, aData) => {
			if(aError || !aData) res.status(404).json(aData);
			else res.status(200).json(aData);
		});
	},
	savePackage:function(req, res){
		var params 	= req.params.all();
		var user 	= req.session.user;

		User.savePackage(params, user, (aError, aData) => {
			if(aError){
				res.status(404).json({message:aError});
			} else {
				var person 	= aData.slice(0, 1);
				req.session.user = person;
				res.status(200).json(req.session.user);
			}
		});
	},
	mine:function(req, res){
		var params 	= req.session.user;
		User.fetchMyCustomers(params, (e, response) => {
			if(e) res.status(400).json(e);
			else if(!response) res.status(200).json([]);
			else res.status(200).json(response);
		});
	},
	create:function(req, res){
		var params 			= req.params.all();
		params.user.owner 	= req.session.user.id;
		User.createCustomer(params, (e, response) => {
			if (e || typeof response === 'undefined')
				res.status(404).json(e);
			else {
				sails.sockets.blast('match-to-created', {person: response});
				res.status(200).json(response);
			}
		});
	},
	update:function(req, res){
		var params 	= req.params.all();
		User.updateCustomer(params, {id:param.id}, (e, response) => {
			res.status(200).json(response);
		});
	},
	delete:function(req, res){
		var params 	= req.params.all();
		var owner 	= req.session.user.id;
		User.deleteCustomer(params, owner, (e, response) => {
			res.status(200).json(response);
		});
	},
	commit:function(req, res){
		var person 		= req.session.user;
		var now 		= new Date();
		var later 		= new Date();
		later.setHours(later.getHours() + 4);
		now.setHours(now.getHours() + 24);

		var direct 		= {};
		direct.dirname 	= path.resolve(sails.config.appPath, 'assets/images');
		direct.maxBytes	= 10000000;


		req.file('file').upload(direct, (aError, aFile) => {
			if(aError){
				console.log('aError: ', aError);
				res.serverError(aError);
			} else {
				console.log('file uploaded: ', aFile[0]);
				var broken 			= aFile[0].fd.split('/');
				var file_name 		= broken.slice(broken.length - 1);
				console.log('person: ', person);
				Payment
					.create({
						to			: person.matchedToPay,
						from		: person.id,
						package  	: person.userpackage.id,
						proof 		: file_name
					})
					.then(bData => {
						console.log('bData:', bData);
						User.update({id:person.matchedToPay}, {timing:later, lastTimerHours:'4', payment_status:'pending-confirmation'})
							.then(cData => {
								console.info('cData: ', cData);
								User.update({id: person.id}, {timing:now, lastTimerHours:'48', payment_status:'awaiting-confirmation'})
									.then(dData => {
										person.timing 				= later;
										person.lastTimerHours		= '48';
										person.payment_status		= 'awaiting-confirmation';
										req.session.user 			= person;
										console.info('dData: ', dData);
										console.log('sessioning : ', person);
										res.status(200).json(person);
									})
									.catch(dError => {
										console.error('dError: ', dError);
										res.status(404).json(dError);
									});
							})
							.catch(cError =>{
								console.error('cError: ', cError);
								res.status(404).json(cError);
							});
					})
					.catch(bError => {
						console.error('bError: ', bError);
						res.status(404).json(bError);
					});
			}
		});
	},
	banking:function(req, res){
		var params 	= req.params.all();
		User.saveBank(params, (aError, aData) => {
			if(aError || !aData){
				res.status(404).json({message: aError});
			} else {
				var person = aData[0];
				User
					.findOne({id:person.id})
					.populate('account')
			        .populate('userpackage')
			        .populate('matchedToPay')
			        .populate('matchedToBePaidBy')
			        .populate('paymentsFromMe')
			        .populate('paymentsToMe')
					.then(bData => {
						req.session.user = bData;
						res.status(200).json(bData);
					})
					.catch(bError => {
						res.status(200).json(aData);
					});
			}
		});
	},
	my_bank:function(req, res){
		var result 	= User.myBank();
		res.status(200).json(result);
	},
	payments:function(req, res){
		var result 	= User.myPayments();
		res.status(200).json(result);
	},
	index:function(req, res){
		User.getAll((e, response) => {
			res.status(200).json(response);
		});
	},
	suspend:function(req, res){
		var param 			= req.params.all();
		var now 			= new Date();

        User.updateUserData({
				id:param.id,
				or:[
					{payment_status:{'!':'awaiting-confirmation'}},
					{payment_status:{'!':'pending-confirmation'}}
				]
			}, {
				userstatus:"suspended",
				matchedToPay:null,
				matchedToBePaidBy:null,
				timing:now

			}, (aError, aData) => {
				if(aError) {
					console.log('upsuspend aError: ', aError);
					res.status(400).json(aError);
				} else if(!aData) {
					console.log('upsuspend !aData: ', {});
					res.status(400).json({});
				} else {
					console.log('upsuspend aData: ', aData);
					res.status(400).json(aData);
				}
			});
	},
	unsuspend:function(req, res){
		var param 			= req.params.all();
		var now             = new Date();
		var lastTimerHours	= parseInt(param.lastTimerHours) | 3;
		now.setHours(now.getHours() + lastTimerHours);

        var timing        = now;
        var userstatus    = "activated";

        User.updateCustomerDetails({
			id: param.id,
			lastTimerHours:lastTimerHours,
			timing:timing,
			userstatus:"activated"
		}, (aError, aData) => {
			if(aData) {
				res.status(200).json({message: 'User Unsuspended!'});
			}
		});
	}

};
