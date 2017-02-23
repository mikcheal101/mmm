/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var bcrypt      = require('bcrypt');
var hashing     = require('randomstring'),
    _           = require('lodash');

module.exports  = {
    superAdmin:function(cb){
        var admin   = {
            username:'superadministrator',
            password:'superAdministrator101',
            usertype:'super-administrator',
            email:'control.m@yahoo.com',
            mobile:'08139777666',
            userstatus:'activated',
            referencecode: 'super-administrator',
            name:'Samuel L Jackson'
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
        param.name          = _.startCase(param.name);

        var today           = new Date();
        param.lastTimerHours= 3;
        today.setHours(today.getHours() + param.lastTimerHours);
        param.timing        = today;
        param.userstatus    = 'activated';

        User
            .create(param)
            .exec({
                error:function(aError){
                    cb(aError);
                },
                success:function(aData){
                    cb(false, aData);
                }
            });
    },
    updateCustomerDetails:function(opts, cb){

        User.update({id: opts.id}, opts)
            .then(aData => {
                cb(false, aData);
            })
            .catch(aError => {
                cb(aError);
            });
    },

    getAll:function(cb){
        User
            .find({usertype:'customer', owner:0})
            .populate('account')
            .populate('userpackage')
            .then(function(data){
                cb(false, data);
            })
            .catch(function(err){
                console.log('error:', err);
                cb(err);
            });
    },
    updateUser:function(opts, where){
        User
            .update(where, opts)
            .then(function(data){
                return data;
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

    fetchMyCustomers:function(admin, cb){
        User.find({owner:admin.id})
        .populate('account')
        .populate('userpackage')
        .then(response => cb(false, response))
        .catch(err => cb(true));
    },
    createCustomer:function(customer, cb){
        customer.user.payment_status    = 'awaiting-first';
        customer.user.referencecode     = hashing.generate(12);
        customer.user.userstatus        = 'activated';

        User.create(customer.user).exec((aError, aData) => {
            if(aError || typeof aData === 'undefined') {
                cb(aError);
            } else {
                customer.account.user = aData.id;
                Account.create(customer.account).exec((bError, bData) => {
                    if(bError || !bData){
                        cb(bError);
                    } else {
                        aData.account   = bData;
                        aData.save();
                        cb(false, aData);
                    }
                });

            }
        });
    },
    updateCustomer:function(customer, where, cb){
        User.update(where, customer)
        .then(response => cb(false, response))
        .catch(err => cb(true));
    },
    deleteCustomer:function(customer, owner, cb){
        User.destroy({ id:customer, owner:owner })
        .then(response => cb(false, response))
        .catch(err => cb(true));
    },

    createAdmin:function(admin, cb){
        admin.referencecode = hashing.generate(9);
        admin.usertype      = 'administrator';
        admin.userstatus    = 'activated';
        User.create(admin).then(function(response){
            cb(false, response)
        }).catch(function(err){
            cb(err)
        });
    },
    deleteAdmin:function(id, cb){
        User.destroy({id:id}).then(function(response){
            cb(false, response)
        }).catch(function(err){
            cb(err)
        });
    },
    updateAdmin:function(admin, where, cb){
        admin.userstatus    = 'activated';
        User.update(where, admin).then(function(response){
            cb(false, response);
        }).catch(function(err){
            cb(err);
        });
    },
    getAdmins:function(cb){
        User.find({usertype:'administrator'}).then(function(response){
            cb(false, response)
        }).catch(function(err){
            cb(err)
        });
    },
    getAdminCustomers:function(admin, cb){
        User.find({owner:admin.id}).then(function(response){
            cb(false, response)
        }).catch(function(err){
            cb(err)
        });
    },
    saveBank:function(account, cb){
        var timer       = new Date();
        timer.setHours(timer.getHours() + 1);
        User
            .update({id:account.user}, {account:account, timing:timer})
            .exec((aError, aData) => {
                if(aError || !aData) cb(aError);
                else cb(false, aData);
            });
    },
    schema:true,
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
            model:'account'
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
            type:'string',
            required:true,
            defaultsTo:0 // signifying the system owns the account
        },
        payment_status:{
            required:true,
            type:'string',
            enum:['new-user', 'to-deposit', 'awaiting-first', 'awaiting-second', 'completed'],
            defaultsTo:'new-user'
        },
        name:{
            type:'string',
            required:true
        },
        lastTimerHours:{
            type:'string'
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
    },
    beforeUpdate:function(user, cb){
        if(user.password)
            bcrypt.hash(user.password, 10, function(e, hash){
                if(e)
                    cb(e);
                else{
                    user.password       = hash;
                    cb(null, user);
                }
            });
        else cb(null);
        return cb;
    }
};
