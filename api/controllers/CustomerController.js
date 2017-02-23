/**
 * CustomerController
 *
 * @description :: Server-side logic for managing Customers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	package:function(req, res){
		var params 	= req.params.all();
		var result	= User.setPackage(params);
		res.status(200).json(result);
	},
	mine:function(req, res){
		var params 	= req.session.user;
		User.fetchMyCustomers(params, (e, response) => {
			res.status(200).json(response);
		});
	},
	create:function(req, res){
		var params 			= req.params.all();
		params.user.owner 	= req.session.user.id;
		User.createCustomer(params, (e, response) => {
			console.log('response: ', response);
			console.log('error: ', e);
			if (e || typeof response === 'undefined')
				res.status(404).json(e);
			else
				res.status(200).json(response);
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
		var params 	= req.params.all();
		var result 	= User.makePayment(params);
		res.status(200).json(result);
	},
	banking:function(req, res){
		var params 	= req.params.all();
		var result 	= User.saveBank(params, (aError, aData) => {
			if(aError || !aData){
				res.status(404).json({message: aError});
			} else {
				var person = aData[0];
				User
					.findOne({id:person.id})
					.populate('account')
	            	.populate('userpackage')
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
        param.userstatus    = "suspended";

        User.updateCustomerDetails(param, (aError, aData) => {
			if(aData) {
				res.status(200).json({message: 'User Suspended!'});
			} else {
				console.log('error: ', aError);
			}
		});
	},
	unsuspend:function(req, res){
		var param 			= req.params.all();
		var now             = new Date();
		param.lastTimerHours= 3;
		now.setHours(now.getHours() + param.lastTimerHours);

        param.timing        = now;
        param.userstatus    = "activated";

        User.updateCustomerDetails(param, (aError, aData) => {
			console.log('aError: ', aError, '; aData: ', aData);
			if(aData) {
				res.status(200).json({message: 'User Unsuspended!'});
			}
		});
	}

};
