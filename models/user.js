var mongoose              = require('mongoose');
var titlize               = require('mongoose-title-case');
var passportLocalMongoose = require('passport-local-mongoose');
var validate              = require('mongoose-validator');
var bcrypt                = require('bcryptjs');
var uniqid                = require('uniqid');

var nameValidator = [
    validate({
        validator: 'matches',
        arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$/,
        message: 'Name Must Be At Least 3 Character, Max 30, No Special Characters Or Numbers, Must Have Space In Between First And Last Name.'
      }),
    validate({
        validator: 'isLength',
        arguments: [3, 20],
        message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
      }),
  ];

  var emailValidator = [
    validate({
        validator: 'isEmail',
        message: 'Is not a valid e-mail'
      }),
    validate({
        validator: 'isLength',
        arguments: [3, 30],
        message: 'E-mail should be between {ARGS[0]} and {ARGS[1]} characters'
      }),
  ];
 

  var usernameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 30],
        message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
      }),
    validate({
        validator: 'isAlphanumeric',
        message: 'Username must contain letters and numbers only'
    })
  ];  

  var passwordValidator = [
    validate({
        validator: 'matches',
        arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/,
        message: 'Password must be 8-35 character long, contain one lowercase, one uppercase, one number and one special character i.e. Password1!'
      }),
  ];

var Schema = mongoose.Schema;

    var UserSchema = new Schema({
        name: {
            type:String,
            required:true,
            validate: nameValidator
        },
        username: {
            type: String,
            lowercase: true,
            required: true,
            unique: true,
            validate: usernameValidator,
            trim: true,
        },
        password:{
            type: String,
            // required: true,
            validate: passwordValidator
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            trim: true,
            validate: emailValidator
        },
        profilePhoto: {
            type: String,
            default:'https://www.ocf.berkeley.edu/~dblab/blog/wp-content/uploads/2012/01/icon-profile.png'
        },
        permission: {
            type: String,
            required: true,
            default: 'user'
        },
        uniqueID: String,
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        // permissionToken: String,
        // permissionTokenExpires: Date,
        slugName: {
            type: String,
            trim: true
        },
        userRef:{
            type: String,
        }
    });

UserSchema.plugin(passportLocalMongoose);

UserSchema.pre('save', function(next){
    this.slugName = slugify(this.name );
    // this.categorySlug = slugify(this.category);
    this.userRef = uniqid();
    next();
});
  
// function to slugify a name
function slugify(text) {
return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

UserSchema.plugin(titlize, {
  paths: ['name'] // Array of paths 
});


module.exports = mongoose.model('User', UserSchema);
