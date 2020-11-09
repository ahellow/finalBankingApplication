const mongoose = require('mongoose');

// 3. Finish the account schema
const AccountSchema = new mongoose.Schema({

    firstname :{
        type: String,
        unique : false,
        required : true
    },

    lastname :{
        type: String,
        unique: false,
        required: false
    },

    balance : {
        type: Number,
        unique : false,
        required : false
    },

    branch : {
        type: String,
        unique: false,
        required: false,
    },

    accountType : {
        type: String,
        unique: false,
        required: false,
    }

});

    //userId: objectId,

    /**
     * the schema follows this structure:
     * <fieldName>: {4
     *  type: <type>,
     *  required: <bool>
     * },
     * <anotherFieldName>: {
     *  type: <type>,
     *  required: <bool>
     * }, and so on. 
     */


//defines account
const AccountModel = mongoose.model('accounts', AccountSchema);

module.exports = AccountModel;