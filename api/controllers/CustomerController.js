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
	commit:function(req, res){
		var params 	= req.params.all();
		var result 	= User.makePayment(params);
		res.status(200).json(result);
	},
	banking:function(req, res){
		var params 	= req.params.all();
		var result 	= User.saveBank(params);
		res.status(200).json(result);
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
		var result 	= User.get();
		res.status(200).json(result);
	},
	suspend:function(req, res){
		var params 	= req.params.all();
		var result 	= User.suspend(params);
		res.status(200).json(result);
	}
};
