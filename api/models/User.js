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
    resetTiming:function(param, cb){
        var now = new Date();
        User.update({id:param.id}, {timing:now}).then(aData => {
            cb(false, aData);
        }).catch(aError => {
            cb(aError);
        });
    },
    getMatch:function(param, cb){
        // update all persons whose awaiting time has ellapsed
        var now = new Date();
        var late= new Date();
        late.setHours(late.getHours() + 1);
        console.log('this.param: ', param);
        // list customers with awaiting-first or awaiting-second order by updatedBy
        User
            .findOne()
            .populate('userpackage')
            .populate('account')
            .where({
                userpackage: param.userpackage.id,
                timing: {'<=': now},
                matchedToBePaidBy:null,
                or:[
                    {payment_status: 'awaiting-first'},
                    {payment_status: 'awaiting-second'}
                ]
            })
            .sort('updatedAt desc')
            .then(aData => {
                if(aData) {
                    Account
                        .findOne({id:aData.account.id})
                        .populate('bank')
                        .then(bData => {
                            aData.account.bank = bData;
                            console.log('aData Banks: ', aData);
                            cb(false, aData);
                        })
                        .catch(bError => {
                            console.log(' : ', bError);
                            cb(bError);
                        });
                } else cb(null, {});
            })
            .catch(aError => {
                console.log('aError: ', aError);
                cb(aError);
            });
    },
    setMatch:function(param, cb){
        var later       = new Date();
        later.setHours(later.getHours()  + 5);
        console.log('param: ', param);
        User
            .update({id:param.me.id}, {matchedToPay:param.person.id, timing:later})
            .then(aData => {
                console.log('aData (1): ', aData);
                User
                    .update({id:param.person.id}, {matchedToBePaidBy:param.me.id})
                    .then(bData => {
                        console.log('bData (1): ', bData);
                        cb(false, {me:aData[0], person:bData[0]});
                    })
                    .catch(aError => {
                        console.log('bError: ', bError);
                        cb(bError);
                    });
            })
            .catch(aError => cb(aError));
    },
    makePayment:function(param, cb){
        cb(true);
    },
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
            .populate('matchedToPay')
            .populate('matchedToBePaidBy')
            .then(function(data){
                cb(false, data);
            })
            .catch(function(err){
                cb(err);
            });
    },
    updateUserData:function(opts, where){
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
    suspend:function(where, data, cb){
        cb(null, {});
        /*
        User
            .update(where, data)
            .exec(aError, aData) => {
                if(aData) {
                    User.update({
                            id:param.matchedToPay,
                            or:[
                                {payment_status:{'!	':'awaiting-confirmation'}},
                                {payment_status:{'!':'pending-confirmation'}}
                            ]
                        }, {
                            matchedToPay:null,
                            matchedToBePaidBy:null,
                            timing:now

                        }).then(bData => {
                            res.status(200).json({message: 'User Suspended!'});
                        }).catch(bError => {
                            console.log('bError: ', bError);
                        });
                } else {
                    console.log('error: ', aError);
                }
            });
            */
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
        .populate('matchedToPay')
        .populate('matchedToBePaidBy')
        .then(response => cb(false, response))
        .catch(err => cb(true));
    },
    createCustomer:function(customer, cb){
        customer.user.payment_status    = 'awaiting-first';
        customer.user.referencecode     = hashing.generate(12);
        customer.user.userstatus        = 'activated';

        User.create(customer.user).exec((aError, aData) => {
            if(aError || typeof aData === 'undefined') {
                console.log('saving my customer: ', aError);
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
                if(aError || !aData) {
                    cb(aError);
                } else {
                    cb(false, aData);
                }
            });
    },
    savePackage:function(param, user, cb){
        var timer       = new Date();
        timer.setHours(timer.getHours() + 8);

        User.update({id:user.id}, {userpackage:param, timing:timer})
            .exec((aError, aData) => {
                if(aError || !aData) {
                    cb(aError);
                } else {
                    delete aData.password;
                    cb(false, aData);
                }
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
            model:'package'
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
            type:'string',
            required:true,
            enum:['new-user', 'to-deposit', 'awaiting-confirmation', 'pending-confirmation', 'awaiting-first', 'awaiting-second', 'completed', 'matched'],
            defaultsTo:'new-user'
        },
        name:{
            type:'string',
            required:true
        },
        lastTimerHours:{
            type:'string'
        },
        matchedToPay:{
            model:'user'
        },
        matchedToBePaidBy:{
            model:'user'
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
