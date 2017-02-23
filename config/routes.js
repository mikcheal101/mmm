/**
* Route Mappings
* (sails.config.routes)
*
* Your routes map URLs to views and controllers.
*
* If Sails receives a URL that doesn't match any of the routes below,
* it will check for matching files (images, scripts, stylesheets, etc.)
* in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
* might match an image file: `/assets/images/foo.jpg`
*
* Finally, if those don't match either, the default 404 handler is triggered.
* See `api/responses/notFound.js` to adjust your app's 404 logic.
*
* Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
* flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
* CoffeeScript for the front-end.
*
* For more information on configuring custom routes, check out:
* http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
*/

module.exports.routes = {


    /***************************************************************************
    *                                                                          *
    * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
    * etc. depending on your default view engine) your home page.              *
    *                                                                          *
    * (Alternatively, remove this and add an `index.html` file in your         *
    * `assets` directory)                                                      *
    *                                                                          *
    ***************************************************************************/
    'get /': {
        view: 'index'
    },

    /***************************************************************************
    *                                                                          *
    * Custom routes here...                                                    *
    *                                                                          *
    * If a request to a URL doesn't match any of the custom routes above, it   *
    * is matched against Sails route blueprints. See `config/blueprints.js`    *
    * for configuration options and examples.                                  *
    *                                                                          *
    ***************************************************************************/

    'post   /authentication/register'       : 'Auth.register',              /// post user details to register
    'post   /authentication/login'          : 'Auth.login',                 /// post details to login
    'post   /authentication/confirm'        : 'Auth.confirm',               /// confirm account from email with confirmation code
    'get    /authentication/session'        : 'Auth.session',               /// get the session attribute
    'get    /authentication/logout'         : 'Auth.logout',                /// url to logout of the system
    'get    /authentication/signout'        : 'Auth.signOut',               /// url to logout of the system without a redirection


    'post   /profile/packages'              : 'Customer.package',           /// post package to register for
    'post   /profile/commit'                : 'Customer.commit',            /// commit payment
    'post   /profile/banking'               : 'Customer.banking',           /// post banking details

    'get    /profile/banking/type'          : 'Account.type',               /// list all the account types

    'get    /profile/packages'              : 'Package',                    /// list all packages
    'get    /profile/banking'               : 'Banking',                    /// list all banks
    'get    /profile/banking/details'       : 'Customer.my_bank',           /// display my banking details
    'get    /profile/payments'              : 'Customer.payments',          /// list all my payments


    /////////////////////////////////////// admin urls ///////////////////////////////////////////

    'get    /banking/bank'                  : 'Banking',                    //// list all the banks
    'get    /banking/account/type'          : 'Account.type',               //// list all the bank account types
    'get    /package'                       : 'Package.index',              //// list all the packages
    'get    /customers'                     : 'Customer.index',             //// list all the customers on the system
    'get    /customers/my'                  : 'Customer.mine',              //// list all the customers registered by me
    'get    /payments'                      : 'Payment.index',              //// list all the payments made
    'get    /web-admin'                     : 'WebAdmin.index',             //// list all the webadmins
    'get    /banking/bank/:id'              : 'Banking.getBank',            //// get a single bank

    'post   /banking/bank'                  : 'Banking',                    //// save a bank
    'post   /banking/account/type'          : 'Account.type',               //// save bank account types
    'post   /package'                       : 'Package.create',             //// create package
    'post   /web-admin'                     : 'WebAdmin.create',            //// create webadmin
    'post   /customers/my'                  : 'Customer.create',            //// create customer

    'put    /banking/bank/:id'              : 'Banking.update',             //// update a bank details
    'put    /banking/account/type/:id'      : 'Account.type',               //// update an account type
    'put    /package/:id'                   : 'Package.update',             //// update a package
    'put    /customers/suspend/:id'         : 'Customer.suspend',           //// suspend a customer account
    'put    /customers/unsuspend/:id'       : 'Customer.unsuspend',         //// unsuspend a customer account
    'put    /customers/my/:id'              : 'Customer.update',            //// update my customer account
    'put    /web-admin/:id'                 : 'WebAdmin.update',            //// update web administrator from super administrator

    'delete /banking/bank/:id'              : 'Banking.delete',             //// delete a bank from the list
    'delete /banking/account/type/:id'      : 'Account.delete',             //// delete an account type
    'delete /package/:id'                   : 'Package.delete',             //// delete package
    'delete /web-admin/:id'                 : 'WebAdmin.delete',            //// delete web administrator from super administrator
    'delete /customers/my/:id'              : 'Customer.delete',            //// delete my customer account

    'get    /routing/management'            : 'Auth.superAdmin',            //// hidden url super admin

    '/public/*'                             : {view: 'index'},              //// angular insecure routes
    '/secure/*'                             : {view: 'index'},              //// routes for the customer in secured mode
    '/super-admin/*'                        : {view: 'index'},              //// routes for the super admin
    '/admin/*'                              : {view: 'index'}               //// routes for web admin

};
