/**
 * PackageController
 *
 * @description :: Server-side logic for managing Packages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index:function(req, res){
		Package.get(null, function(e, d){
			res.status(200).json(d);
		});
	},
	create:function(req, res){
		var params 	= req.params.all();
		Package.create(params, function(e, d){
			res.status(200).json(d);
		});
	},
	update:function(req, res){
		var params 	= req.params.all();
		Package.update(params, function(e, d){
			res.status(200).json(d);
		});
	},
	delete:function(req, res){
		var params 	= req.params.all();
		Package.delete(params, function(e, d){
			res.status(200).json(d);
		});
	}
};
