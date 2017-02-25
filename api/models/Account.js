/**
 * Account.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    schema:true,
    attributes: {
        user:{
            model:'user',
            required:true
        },
        bank:{
            model:'bank',
            required:true
        },
        name:{
            type:'string',
            required:true
        },
        number:{
            type:'string',
            required:true
        },
        account_type:{
            type:'string',
            enum:['savings', 'current'],
            defaultsTo:'savings',
            required:true
        },
        beforeCreate(values, cb){
            values.number   = trim(values.number);
            values.name     =_.startCase(values.name);
            cb(null);
        }, beforeUpdate(values, cb){
            values.number = trim(values.number);
            values.name     =_.startCase(values.name);
            cb(null);
        }
    },
    index:function(user, cb){
        Account.find({user:user}).populate('bank').exec((err, response) => {
            if(err || !response) cb(err);
            else cb(false, response);
        });
    }
};
