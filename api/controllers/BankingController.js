/**
 * BankingController
 *
 * @description :: Server-side logic for managing Bankings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index:function(req, res){
		var params 	= req.params.all();
		var result	= {};

		if(req.method === 'POST'){
			result = Bank.save(params);
		}

		if(req.method === 'GET'){
			result = Bank.get();
		}

		res.status(200).json(result);
	},
	update:function(req, res){
		var params 	= req.params.all();
		var result 	= Bank.update(params);
		res.status(200).json(result);
	},
	delete:function(req, res){
		var params 	= req.params.all();
		var result 	= Bank.delete(params);
		res.status(200).json(result);
	}
};
