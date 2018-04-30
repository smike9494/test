var mongoose = require('mongoose');
var moment   = require('moment'); 



var mainArticleSchema = new mongoose.Schema({
  image: {
    type: String,
    trim: true
  },
  metaDescription: {
    type: String,
    trim:true
  },
  priority: {
    type: String,
    default: "",
    trim: true
  },
  title: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    trim: true
  },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      trim: true
    },
    username: {
      type: String,
      trim: true
    },
    name: {
      type: String,
      trim: true
    },
    photo: {
      type: String,
      default: 'https://www.ocf.berkeley.edu/~dblab/blog/wp-content/uploads/2012/01/icon-profile.png'
    },
    slugName: {
      type: String,
    },
    userRef: {
      type: String
    }
  },
  slug: {
    type: String,
    unique: true,
    trim: true
  },
  status: {
    type: String,
    trim: true
  },
  viewCount: {
    type: Array,
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      trim: true
   } 
  },
  category: {
    type: String,
    trim: true
  },
  categorySlug: {
    type: String,
    trim: true
  },
  dateSlug: {
    type: String,
    trim: true
  },
  tags: {
    type: String,
    trim: true
  },
  updated: {
    type: Boolean,
    default: false,
  },
  date: { type: Date, default: Date.now , trim: true},
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      trim: true
    },
  ],
},{
  timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
 });

//Middleware
//Make Sure The Slug Is Created From The Title

var randomNumber=Math.random().toString();
var uid = randomNumber.substring(2,randomNumber.length);

mainArticleSchema.pre('save', function(next){
  this.slug = slugify(this.title ) + '_' + uid;
  this.categorySlug = slugify(this.category);
  this.dateSlug = moment(Date.now());
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

mainArticleSchema.virtual('url').get(function() {
  var date = moment(this.date)
    , formatted = date.format('YYYY[/]MM[/]');

  // formatted results in the format '2012/10/'

mainArticleSchema.set('toObject', { getters: true });  

  return formatted + this.slug;
});

// var MainArticle = mongoose.model('MainArticle', mainArticleSchema);

module.exports = mongoose.model('MainArticle', mainArticleSchema);

