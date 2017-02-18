/**
 * AccountController
 *
 * @description :: Server-side logic for managing Accounts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	type:function(req, res){
		var params 	= req.params.all();
		var result	= {};

		// update account type
		if(req.method === 'PUT'){
			// update
			result = Account.update(params);
		}

		//	save accounting info
		if(req.method === 'POST'){
			result = Account.create(params);
		}

		// list account type
		if(req.method === 'GET'){
			result = Account.types(params);
		}

		res.status(200).json(result);
	},
	delete:function(req, res){
		var params 	= req.params.all();
		var result 	= Account.delete(params);
		res.status(200).json(result);
	},
	index:function(req, res){
		var params 	= req.params.all();
		var result 	= Account.delete(params);
		res.status(200).json(result);
	}
};
