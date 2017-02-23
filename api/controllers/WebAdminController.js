/**
 * WebAdminController
 *
 * @description :: Server-side logic for managing Webadmins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const _         = require('lodash');
module.exports 	= {
	index:function(req, res){
		User.getAdmins(function(e,d){
			res.status(200).json(d);
		});
	},
	delete:function(req, res){
		var params 		= req.params.all();
		User.deleteAdmin({id:params.id}, function(e,d){
			res.status(200).json(d);
		})
	},
	update:function(req, res){
		var params 		= req.params.all();
		params.name 	= _.startCase(params.name);
		User.updateAdmin(params, {id:params.id}, function(e,d){
			res.status(200).json(d);
		})
	},
	create:function(req, res){
		var params 		= req.params.all();
		params.name 	= _.startCase(params.name);
		User.createAdmin(params, function(e,d){
			res.status(200).json(d);
		})
	}

};
