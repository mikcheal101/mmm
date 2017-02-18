/**
 * UserPackage.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        user:{
            collection:'user',
            via:'userpackage'
        },
        package:{
            collection:'package',
            via:'userpackage'
        },
        status:{
            type:'string',
            required:true,
            enum:['pending-payment', 'paid', 'cancelled'],
            defaultsTo:'pending-payment'
        }
    }
};
