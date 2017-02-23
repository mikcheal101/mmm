/**
 * BankingController
 *
 * @description :: Server-side logic for managing Bankings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const _         = require('lodash');
module.exports = {
	index:function(req, res){
		var params 	= req.params.all();

		if(req.method === 'POST'){
			params.name	= _.startCase(params.name);
			Bank.saveBank(params, function(e, d){
				res.status(200).json(d);
			});
		}

		if(req.method === 'GET'){
			Bank.getBanks(function(e, d){
				res.status(200).json(d);
			});
		}

		else res.status(200).json({message:'no such url'});
	},
	getBank:function(req, res){
		var params 	= req.params.all();
		Bank.getBank(params, (e, data) => res.status(200).json(data));
	},
	update:function(req, res){
		var params 	= req.params.all();
		params.name	= _.startCase(params.name);
		Bank.updateBank(params, {id:params.id}, function(e, d){
			res.status(200).json(d);
		});
	},
	delete:function(req, res){
		var params 	= req.params.all();
		Bank.deleteBank(params, function(e, d){
			res.status(200).json(d);
		});
	}
};
