/**
 * Bank.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    schema:true,
    attributes: {
        name: {
            type: 'string',
            required:true
        },
        account:{
            collection:'account',
            via:'bank'
        }
    },

    getBanks:function(cb){
        Bank.find({})
        .populate('account')
        .then(response => {
            cb(false, response);
        }).catch(err => {
            cb(err);
        });
    },
    saveBank:function(opts, cb){
        Bank.create(opts).then(function(response){
            cb(false, response);
        }).catch(function(err){
            cb(err);
        });
    },
    updateBank:function(opts, where, cb){
        Bank.update(where, opts).then(function(response){
            cb(false, response);
        }).catch(function(err){
            cb(err);
        });
    },
    deleteBank:function(opts, cb){
        Bank.destroy({id:opts.id}).then(function(response){
            cb(false, response);
        }).catch(function(err){
            cb(err);
        });
    },
    getBank:function(opts, cb){
        Bank.findOne({id:opts.id}).then(aData => {
            cb(false, aData);
        }).catch(err => {
            cb(err);
        });
    }
};
