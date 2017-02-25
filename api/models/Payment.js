/**
 * Payment.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        from:{
            model:'user',
            required:true
        },
        to:{
            model:'user',
            required:true
        },
        package:{
            model:'package',
            required:true
        },
        proof:{
            type:'string',
            required:true,
            unique:true
        },
        paymentstatus:{
            type:'string',
            enum:['pending-approval', 'approved'],
            required:true,
            defaultsTo:'pending-approval'
        }
    },

    get:function(options, cb){
        Payment
            .find()
            .populate('paymentstatus')
            .then(function(data){
                return data.pop().toJSON();
            })
            .catch(function(err){
                return;
            });
    }
};
