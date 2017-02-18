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
            type:'number',
            required:true
        },
        userpackage:{
            model:'userpackage'
        }
    },

    get:function(opts, cb){
        Paackage
            .find()
            .populate('user')
            .then(function(d){
                return d;
            })
            .catch(function(e){
                return;
            });
    },
    update:function(opts, where, cb){
        Package
            .update(opts, where)
            .then(function(d){
                return d;
            })
            .catch(function(e){
                return;
            });
    },
    create:function(opts, cb){
        Package
            .create(opts)
            .then(function(d){
                return d;
            })
            .catch(function(e){
                return;
            });
    },
    delete:function(opts, cb){
        Package
            .delete(opts)
            .then(function(d){
                return d;
            })
            .catch(function(e){
                return;
            });
    }
};
