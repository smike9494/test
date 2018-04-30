const bcrypt  = require('bcryptjs');
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema   = mongoose.Schema;

//Create A Schema
const userSchema = new Schema({
    method: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        required: true
    },
    local: {
        email:{
            type:String,
            lowerCase: true
        },
        password: {
            type: String,
        }
    },
    google: {
        id: {
            type: String,
        },
        email: {
            type: String,
            lowerCase: true
        }
    },
    facebook: {
        id: {
            type: String,
        },
        email: {
            type: String,
            lowerCase: true
        }
    }
});

userSchema.pre('save', async function(next) {
    try {
    // Generate A Salt
    if(this.method != 'local') {
        next();
    }
    const salt = await bcrypt.genSalt(10);
        // Generate A Password Hash (Salt + Hash)
    const passwordHash = await bcrypt.hash(this.local.password, salt);
        // Set Unhashed Password To Hashed Password
    this.local.password = passwordHash;
    next();
    } catch(error) {
        next(error);
    }
});

userSchema.methods.isValidPassword = async function(newPassword) {
    try {
       return await bcrypt.compare(newPassword, this.local.password);
    } catch(error) {
        throw new Error(error);
    }
}

//Create A Model
const User = mongoose.model('user', userSchema);

userSchema.plugin(passportLocalMongoose);

//Export The Model
module.exports = User;