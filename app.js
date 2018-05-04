var express            = require('express');
var app                = express();
var bodyParser         = require('body-parser');
var mongoose           = require('mongoose');
var methodOverride     = require('method-override');
var exsanitizer        = require('express-sanitizer');
var passport           = require('passport');
var LocalStrategy      = require('passport-local');
var moment             = require('moment');
var momentTZ           = require('moment-timezone');
var User               = require('./models/user');
var Morgan             = require('morgan');
var cookieParser       = require('cookie-parser');
var flash              = require('connect-flash');
var uuidv1             = require('uuid/v1');
var expressValidator   = require('express-validator');
var path               = require('path');
var multer             = require('multer');
var GridFsStorage      = require('multer-gridfs-storage');
var Grid               = require('gridfs-stream');
var session            = require('express-session');
var nodemailer         = require('nodemailer');
var async              = require('async');
var crypto             = require('crypto');
var config             = require('./config/database')

//Routes
var commentsRoute  = require('./routes/comments');
var articlesRoute  = require('./routes/articles');
var indexRoute     = require('./routes/index');
var streamsRoute   = require('./routes/streams');
var categoryRoute  = require('./routes/categories');
var RBACRoute      = require('./routes/rbac');

// require('./config/passport')(passport);

mongoose.connect(config.database);

var dbURL = 'mongodb://localhost/grid'

var conn = mongoose.createConnection(dbURL);

let gfs;

conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo)
  gfs.collection('uploads')
});

//Create Storage Stream

var storage = new GridFsStorage({
  url: dbURL,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

// Route Post /upload
app.post('/upload', upload.single('file'), function(req, res) {
   gfs.files.find().toArray((err, files) => {
    //CHECK IF FILES
    if(!files || files.length === 0) {
      return res.status(404).json({
        err:'No Files Exist'
      })
    }
    // FILES EXIST
    return res.json(files);
  });
});

//Route GET /files
app.get('/files', function(req,res){
  gfs.files.find().toArray((err, files) => {
    //CHECK IF FILES
    if(!files || files.length === 0) {
      return res.status(404).json({
        err:'No Files Exist'
      })
    }
    // FILES EXIST
    return res.json(files);
  });
});

//Route GET /files/:filename
app.get('/files/:filename', function(req,res){
gfs.files.findOne({filename: req.params.filename}, (err, file) => {
  // If No File
    if(!file || file.length === 0) {
      return res.status(404).json({
        err:'No Files Exist'
      })
    }
  // If File
  return res.json(file);  
  });
});

//Route GET /files/image/:filename
//Display Image
app.get('/uploads/image/:filename', function(req,res){
  gfs.files.findOne({filename: req.params.filename}, (err, file) => {
    // If No File
      if(!file || file.length === 0) {
        return res.status(404).json({
          err:'No Files Exist'
        })
      }
    // Check If Image
  if(file.contentType === 'image/jpeg' || file.contentType === 'img/png') {
    //Read Output Of Image
    var readStream = gfs.createReadStream(file.filename);
    readStream.pipe(res);
  } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});

app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(exsanitizer());
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(Morgan('dev'));
app.use(cookieParser());

// Express-Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(function (req, res, next) {
  // check if client sent cookie
  var cookie = req.cookies.cookieName;
  // console.log('app.js req.cookies.cookieName',req.cookies.cookieName);
  // console.log("===========================================");
  // var cookie = req.cookies;
  if (cookie === undefined)
  {
    // no: set a new cookie
    var uid = uuidv1();
    // var randomNumber=Math.random().toString();
    // randomNumber=randomNumber.substring(2,randomNumber.length);
    res.cookie('cookieName', uid , {  expires: new Date(Date.now() + 31556952000), httpOnly: true });
    // console.log('app.js','cookie created successfully');
    // console.log('===========================================');
  } 
  else
  {
    // yes, cookie was already present 

    // console.log('app.js','cookie exists', cookie);
    // console.log('===========================================');
  } 
  next(); // <-- important!
});

//Passport Configuration
app.use(require('express-session')({
    secret: 'As Iron Sharpens Iron, So One Person Sharpens Another',
    resave: false,
    saveUninitialized: false,
    cookie: {  expires: new Date(Date.now() + 31556952000), httpOnly: true },
    
  }));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.moment = moment;
    res.locals.momentTZ = momentTZ;
    next();
  });
  
moment.tz.add('America/Los_Angeles|PST PDT|80 70|0101|1Lzm0 1zb0 Op0');

app.use(commentsRoute);
app.use(articlesRoute);
app.use(streamsRoute);
app.use(categoryRoute);
app.use(RBACRoute);
app.use(indexRoute);

var port = process.env.PORT || 3001;

app.listen( port, function () {
    console.log('Server has started.....');
  });


