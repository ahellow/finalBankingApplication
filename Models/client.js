const { ObjectId, ObjectID } = require('mongodb');
const mongoose = require('mongoose');

// 3. Finish the account schema
const ClientSchema = new mongoose.Schema({
    
    firstname :{
        type: String,
        unique : false,
        required : true
    },

    lastname :{
        type: String,
        unique: false,
        required: true
    },


    streetAddress : {
        type: String,
        unique: false,
        required: true
    },

    city : {
        type: String,
        unique: false,
        required: true
    }

});

const ClientModel = mongoose.model('Client', ClientSchema);

module.exports = ClientModel;
