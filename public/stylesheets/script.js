$(document).ready(function () {

      // $(window).scroll(function () {
      //   if ($(this).scrollTop() > 150 && $(window).width() > 480) {
      //     $('.navbar').addClass('sticky');
      //     $(' #menuToggle').css('display', 'block');
      //     $(' #menuToggle').css('top', '15px');
      //     $('.navbar-nav').css('display','none');
      //     $('#sticky-logo').css('display','grid');
      //     $('#sticky-social').css('display','flex');
      //     $('.ul-displayFlex').css('display', 'none !important');
      //     $('.absolute-right90px').css('top', '');
      //   } else {
      //     $('.navbar').removeClass('sticky');
      //     $('#menuToggle').css('display', 'none');
      //     $('#sticky-social').css('display','none');
      //     $('.navbar-nav').css('display','flex');
      //     $('#sticky-logo').css('display','none');
      //     $('.content').removeClass('transformMenu');
      //     $('.menuToggle').removeClass('active');
      //   }
      // });


       $(window).scroll(function () {
        if ($(this).scrollTop() > 150 && $(window).width() > 480) {
          $('.translateMenuDownY').css('transform', 'translateY(0)');
        } else {
          $('.translateMenuDownY').css('transform', 'translateY(-100px)');
          $('.content').removeClass('transformMenu');
          $('.menuToggle').removeClass('active');
        }
      });

      $(window).scroll(function () {
        if ($(this).scrollTop() > 350 && $(window).width() > 480) {
          $('.absolute_SocialShare').removeClass('translate_SocialShare');
        }
      });
    
      $(window).scroll(function () {
        if ($(this).scrollTop() > $('.view-count').offset().top - 30 && $(window).width() > 480) {
          $('.absolute-left90px').css('display', 'grid');
          $('.absolute-left90px').css('opacity', '1');
          $('.absolute-left90px').css('visibility', 'visible');
        } else {
          $('.absolute-left90px').css('visibility', 'hidden');
          $('.absolute-left90px').css('opacity', '0');
          $('.absolute_SocialShare').removeClass('translate_SocialShare');
        }
      });

      $(window).scroll(function () {
        if ($(this).scrollTop() > $('.view-count').offset().top - 30 &&  $(window).width() < 480 ) {
          $('.title-container_MobileNav').css('transform', 'translateY(50px)');
          $('.translateY_px' ).css('transform', 'translateY(-36px)');
        } else {
          $('.title-container_MobileNav').css('opacity', '1');
          $('.title-container_MobileNav').css('display', 'grid');
          $('.title-container_MobileNav').css('transform', 'translateY(0)');
          $('.translateY_px' ).css('transform', 'translateY(-100px)');
        }
      });


      if ($(window).width() < 480) {
        $('.sideAndBottomSocial').removeClass('ssk-round');
        $('.sideAndBottomSocial').css('padding','0');
        $('.logo_MobileNav').css('display','block');
        $('.logo').css('display','none');
      } else {
        $('.sideAndBottomSocial').addClass('ssk-round');
        $('.sideAndBottomSocial').css('padding','95');
      }
     
      if ($(window).width() > 1300 ) {
        $('.absolute-left90px').css('left', '25%');
        $('.absolute-right90px').css('right', '30%');
      } 
      if ($(window).width() > 1300 ) {
        $('.absolute-left90px').css('top', '30%');

      } 


      
    
      if ($(this).scrollTop() > ('.popup') && ($(window).width() < 480)) {
        $('.ssk-lg>.ssk').css('display', 'block');
      }




     if ($(window).width()) {
      $( ".latest-headlines ul li" ).last().css( "border-bottom", "none" );
      $( ".section-one ul li" ).last().css( "border-bottom", "none" );
      $( ".section-two ul li" ).last().css( "border-bottom", "none" );
      $( ".section-three ul li" ).last().css( "border-bottom", "none" );
    };
      

$(function () {
    $('.textarea').froalaEditor();
});


window.onscroll = function() {myFunction()};

function myFunction() {
  var winScroll = document.body.scrollTop || document.documentElement.scrollTop ;
  var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var scrolled = (winScroll / height) * 100;
  document.getElementById("myBar").style.width = scrolled + "%";
  
}
  
setTimeout(fade_out, 1000);

function fade_out() {
  $(".success-message").fadeOut().empty();
  $(".error-message").fadeOut().empty();
}

// $('textarea').autoResize();



// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

document.querySelector("html").classList.add('js');

var fileInput  = document.querySelector( ".input-file" ),  
    button     = document.querySelector( ".input-file-trigger" ),
    the_return = document.querySelector(".file-return");
      
button.addEventListener( "keydown", function( event ) {  
    if ( event.keyCode == 13 || event.keyCode == 32 ) {  
        fileInput.focus();  
    }  
});
button.addEventListener( "click", function( event ) {
   fileInput.focus();
   return false;
});  
fileInput.addEventListener( "change", function( event ) {  
    the_return.innerHTML = this.value;  
});  
    



});

// Get the modal
var modalMenuBurger = document.getElementById('myModalMenuBurger');

var content = document.getElementsByClassName('content')[0];

// Get the button that opens the modal
var btnMenuBurger = document.getElementById("buttonMenuToggle");

// Get the <span> element that closes the modal
var spanMenuBurger = document.getElementsByClassName("Desktopclose")[0];

// When the user clicks on the button, open the modal 
btnMenuBurger.onclick = function() {
  $('.content').toggleClass('transformMenu');
}

// When the user clicks on <span> (x), close the modal
spanMenuBurger.onclick = function() {
  $('.content').removeClass('transformMenu');
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == content ) {
      $('.content').removeClass('transformMenu');
      $('.menuToggle').removeClass('active');
    }
}
 
$('.menuToggle').click(function () {
  $('.menuToggle').toggleClass('active');
});

$('.Desktopclose').click(function () {
  $('.menuToggle').removeClass('active');
});




//MOBILE NAV

// Get the modal
var modalMobileMenuBurger = document.getElementById('myModalMobileMenuBurger');

// Get the button that opens the modal
var btnMobileMenuBurger = document.getElementById("myMobileBtnMenuBurger");

// Get the <span> element that closes the modal
var spanMobileMenuBurger = document.getElementsByClassName("Mobileclose")[0];

// When the user clicks on the button, open the modal 
btnMobileMenuBurger.onclick = function() {
  $('.content').toggleClass('transformMenu');
}

// When the user clicks on <span> (x), close the modal
spanMobileMenuBurger.onclick = function() {
  $('.content').removeClass('transformMenu');
}

// When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//     if (event.target == content ) {
//       $('.content').removeClass('transformMenu');
//     }
// }

var shareIcon = document.getElementById('share_List');
var pageContent = document.getElementsByClassName('page-content');

// var hiddenSocial = document.getElementById('absolute_SocialShare');

shareIcon.onclick = function() {
  $('.absolute_SocialShare').toggleClass('translate_SocialShare');
}

window.onclick = function(event) {
  if (event.target == pageContent ) {
    $('.absolute_SocialShare').removeClass('translate_SocialShare');
  }
}