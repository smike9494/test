var mongoose = require("mongoose");
var MainArticle = require("./models/article");
var Comment = require("./models/comment");



var data = [
    {
        title:"Barbra Streisand Says Trump Passed Tax Reform For 'Personal Gain.' Then Shapiro Reminds Her Of An Awkward Piece Of Her Own History.",
        image:"https://www.dailywire.com/sites/default/files/styles/169large/public/uploads/2016/08/ap16135067573644.jpg?itok=BqPQixpn",
        content:"On Thursday, Barbra Streisand took to Twitter to sound off about the evils of other Americans keeping their money. She tweeted out a piece from Charles Blow of The New York Times calling the tax reform bill “The Great American Tax Heist,” and included her own commentary:",
        author:"Michael Sanders",
        category:"Breaking News"
    },
    // {
    //     title:"Barbra Streisand Says Trump Passed Tax Reform For 'Personal Gain.' Then Shapiro Reminds Her Of An Awkward Piece Of Her Own History.",
    //     image:"https://www.dailywire.com/sites/default/files/styles/169medium/public/uploads/2017/01/trudeau1.jpg?itok=7PpDDSzV",
    //     content:"On Thursday, Barbra Streisand took to Twitter to sound off about the evils of other Americans keeping their money. She tweeted out a piece from Charles Blow of The New York Times calling the tax reform bill “The Great American Tax Heist,” and included her own commentary:",
    //     author:"Michael Sanders",
    //     category:"Politics"
    // },
    // {
    //     title:"REPORT: U.S. Preparing 'Bloody Nose' Attack On North Korea",
    //     image:"https://www.dailywire.com/sites/default/files/styles/article_full/public/uploads/2017/12/gettyimages-630448538_0.jpg?itok=WnjeI7nV",
    //     content:"On Thursday, Barbra Streisand took to Twitter to sound off about the evils of other Americans keeping their money. She tweeted out a piece from Charles Blow of The New York Times calling the tax reform bill “The Great American Tax Heist,” and included her own commentary:",
    //     author:"Michael Sanders",
    //     category:"Worldwide"
    // }
];



function seedDB() {
    //REMOVE ALL ARTICLES
  MainArticle.remove({}, function (err) {
      if (err) {
          console.log(err);
      };
  //     console.log("Removed All Articles");
  // //       //ADD A FEW ARTICLES
  //       data.forEach(function(seed){
  //           MainArticle.create(seed, function(err, article){
  //               if(err){
  //                   console.log(err);
  //               } else {
  //                   console.log("Added A New Article");
  //                   //CREATE A COMMENT
  //                   Comment.create(
  //                       {
  //                           text:"Awesome Post",
  //                           author:"Jake Pual"
  //                       }, function(err, comment){
  //                           if(err){
  //                               console.log(err);
  //                           } else {
  //                               article.comments.push(comment);
  //                               article.save();
  //                               console.log("Created New Comment");
  //                           }
  //                       });
  //               }
  //           });
  //       });
  });
}


module.exports = seedDB;
