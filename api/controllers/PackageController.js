/**
 * PackageController
 *
 * @description :: Server-side logic for managing Packages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const _         = require('lodash');
module.exports = {
	index:function(req, res){
		Package.getPackages(null, function(e, d){
			res.status(200).json(d);
		});
	},
	getOne:function(req, res){
		var params 	= req.params.all();
		Package.getPackage({id:params.id}, function(e, d){
			res.status(200).json(d);
		});
	},
	create:function(req, res){
		var params 	= req.params.all();
		params.name = _.startCase(params.name);
		Package.savePackage(params, function(e, d){
			res.status(200).json(d);
		});

	},
	update:function(req, res){
		var params 	= req.params.all();
		params.name = _.startCase(params.name);
		Package.updatePackage(params,{id:params.id}, function(e, d){
			res.status(200).json(d);
		});
	},
	delete:function(req, res){
		var params 	= req.params.all();
		Package.deletePackage(params, function(e, d){
			res.status(200).json(d);
		});
	}
};
