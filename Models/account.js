const { ObjectID, ObjectId } = require('mongodb');
const mongoose  = require('mongoose');
const Schema = mongoose.Schema;
const ClientModel = require('./client');

// 3. Finish the account schema
const AccountSchema = new mongoose.Schema({
    
    client_id : {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
    },

    balance : {
        type: Number,
        unique : false,
        required : false
    },
    
    alias : {
        type: String,
        unique: false,
        required: false,
    },


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


//defines Account
const AccountModel = mongoose.model('Account', AccountSchema);

module.exports = AccountModel;