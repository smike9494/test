var mongoose = require('mongoose');
var titlize  = require('mongoose-title-case');
var passportLocalMongoose = require('passport-local-mongoose');

var Schema = mongoose.Schema;

const UserSchema = new Schema({
    method: {
        type: String,
        enum: ['google', 'facebook'],
        // required: true
    },
    google: {
        id: {
            type: String,
        },
        email: {
            type: String,
            lowerCase: true
        },
        name: {
            type: String
        }
    },
    facebook: {
        id: {
            type: String,
        },
        email: {
            type: String,
            lowerCase: true
        },
        name: {
            type: String,
            
        }
    }
});

module.exports = mongoose.model('AuthUser', UserSchema);