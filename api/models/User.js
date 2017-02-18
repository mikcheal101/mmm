/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var bcrypt      = require('bcrypt');
var hashing     = require('randomstring');

module.exports  = {
    superAdmin:function(cb){
        var admin   = {
            username:'superadministrator',
            password:'superAdministrator101',
            usertype:'super-administrator',
            email:'control.m@yahoo.com',
            mobile:'08139777666',
            userstatus:'activated',
            referencecode: 'super-administrator'
        };
        User
            .findOrCreate(admin, admin)
            .exec({
                error:function(err){
                    cb(err);
                },
                success:function(d){
                    cb(false, d);
                }
            });
    },
    save:function(param, cb){
        param.referencecode = hashing.generate(12);
        var today           = new Date();
        today.setHours(today.getHours() + 4);
        param.timing        = today;

        User
            .create(param)
            .exec({
                error:function(err){
                    cb(true);
                },
                success:function(data){
                    cb(false, data);
                }
            });
    },
    getAll:function(){
        User
            .find()
            .populate('usertype')
            .populate('useraccount')
            .populate('userpackage')
            .populate('userstatus')
            .then(function(data){
                return data.pop.toJSON();
            })
            .catch(function(err){
                return;
            });
    },
    update:function(opts, where){
        User
            .update(opts, where)
            .then(function(data){
                return data.pop.toJSON();
            })
            .catch(function(err){
                return;
            });
    },
    drop:function(id){
        User
            .delete(id)
            .then(function(data){
                return data.pop.toJSON();
            })
            .catch(function(err){
                return;
            });
    },
    suspend:function(id){

        return;
    },
    authenticate:function(opts){
        User
            .find(opts)
            .then(function(data){
                return data;
            })
            .catch(function(err){
                return;
            });
    },

    attributes: {
        username:{
            type:'string',
            required:true,
            unique:true
        },
        referencecode:{
            type:'string',
            required:true,
            unique:true
        },
        password:{
            type:'string',
            required:true
        },
        usertype:{
            type:'string',
            required:true,
            enum:['super-administrator', 'administrator', 'customer'],
            defaultsTo:'customer'
        },
        email:{
            type:'string',
            required:true,
            unique:true
        },
        mobile:{
            type:'string',
            required:true,
            unique:true
        },
        account:{
            collection:'account',
            via:'user'
        },
        userstatus:{
            type:'string',
            required:true,
            enum:['pending', 'paused', 'suspended', 'activated'],
            defaultsTo:'pending'
        },
        userpackage:{
            model:'userpackage'
        },
        timing:{
            type:'datetime'
        },
        owner:{
            type:'number',
            required:true,
            defaultsTo:0 // signifying the system owns the account
        },
        toJSON:function(){
            var obj     = this.toObject();
            delete obj.password;
            return obj;
        }
    },

    beforeCreate:function(user, cb){
        bcrypt.hash(user.password, 10, function(e, hash){
            if(e)
                cb(e);
            else{
                user.password       = hash;
                cb(null, user);
            }
        });

        return cb;
    }
};
