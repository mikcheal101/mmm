/**
 * Package.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */


module.exports = {

    attributes: {
        name: {
            type: 'string',
            required:true
        },
        amount:{
            type:'string',
            required:true
        },
        users:{
            collection:'user',
            via:'userpackage'
        }
    },

    getPackages:function(opts, cb){
        Package
            .find()
            .populate('users')
            .then(function(d){
                cb(false, d);
            })
            .catch(function(e){
                cb(e);
            });
    },
    getPackage:function(opts, cb){
        Package
            .findOne({id:opts})
            .populate('users')
            .then(function(d){
                cb(false, d);
            })
            .catch(function(e){
                cb(e);
            });
    },
    updatePackage:function(opts, where, cb){
        Package
            .update(where, opts)
            .then(function(d){
                cb(false, d);
            })
            .catch(function(e){
                cb(e);
            });
    },
    savePackage:function(opts, cb){
        Package
        .create({
            name: opts.name,
            amount: parseInt(opts.amount)
        })
        .then(function(d){
            cb(false, d);
        })
        .catch(function(e){
            cb(e);
        });
    },
    deletePackage:function(opts, cb){
        Package
            .destroy({id:opts.id})
            .then(function(d){
                cb(false, d);
            })
            .catch(function(e){
                cb(e);
            });
    }
};
