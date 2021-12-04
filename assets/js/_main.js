/* ==========================================================================
   jQuery plugin settings and other scripts
   ========================================================================== */

$(document).ready(function() {
  // Sticky footer
  var bumpIt = function() {
      $("body").css("margin-bottom", $(".page__footer").outerHeight(true));
    },
    didResize = false;

  bumpIt();

  $(window).resize(function() {
    didResize = true;
  });
  setInterval(function() {
    if (didResize) {
      didResize = false;
      bumpIt();
    }
  }, 250);

  // FitVids init
  $("#main").fitVids();

  // Sticky sidebar
  var stickySideBar = function() {
    var show =
      $(".author__urls-wrapper button").length === 0
        ? $(window).width() > 1024 // width should match $large Sass variable
        : !$(".author__urls-wrapper button").is(":visible");
    if (show) {
      // fix
      $(".sidebar").addClass("sticky");
    } else {
      // unfix
      $(".sidebar").removeClass("sticky");
    }
  };

  stickySideBar();

  $(window).resize(function() {
    stickySideBar();
  });

  // Follow menu drop down
  $(".author__urls-wrapper button").on("click", function() {
    $(".author__urls").toggleClass("is--visible");
    $(".author__urls-wrapper button").toggleClass("open");
  });

  // Search toggle
  $(".search__toggle").on("click", function() {
    $(".search-content").toggleClass("is--visible");
    $(".initial-content").toggleClass("is--hidden");
    // set focus on input
    setTimeout(function() {
      $(".search-content input").focus();
    }, 400);
  });

  // init smooth scroll
  $("a").smoothScroll({ offset: -20 });

  // add lightbox class to all image links
  $(
    "a[href$='.jpg'],a[href$='.jpeg'],a[href$='.JPG'],a[href$='.png'],a[href$='.gif'],a[href$='.webp']"
  ).addClass("image-popup");

  // Magnific-Popup options
  $(".image-popup").magnificPopup({
    // disableOn: function() {
    //   if( $(window).width() < 500 ) {
    //     return false;
    //   }
    //   return true;
    // },
    type: "image",
    tLoading: "Loading image #%curr%...",
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
    },
    image: {
      tError: '<a href="%url%">Image #%curr%</a> could not be loaded.'
    },
    removalDelay: 500, // Delay in milliseconds before popup is removed
    // Class that is added to body when popup is open.
    // make it unique to apply your CSS animations just to this exact popup
    mainClass: "mfp-zoom-in",
    callbacks: {
      beforeOpen: function() {
        // just a hack that adds mfp-anim class to markup
        this.st.image.markup = this.st.image.markup.replace(
          "mfp-figure",
          "mfp-figure mfp-with-anim"
        );
      }
    },
    closeOnContentClick: true,
    midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
  });
});

// ------------------------------------------
//  Instructions for JS & plugins here:
//  https://mmistakes.github.io/minimal-mistakes/docs/javascript/

// -------------------------------------------
// Translation function: load both versions & hide/show them as needed

function toggleLang() {
  var langTag = $('.lang-link');
  if (langTag.text() == 'Français') {
    $('.FR').show();
    $('.EN').hide();
    langTag.text('English');
  } else if (langTag.text() == 'English') {
    $('.EN').show();
    $('.FR').hide();
    langTag.text('Français');
 }
}

// ------------------------------------------------
// Accordion for home page
// https://codepen.io/brenden/pen/Kwbpyj
// -----------------------------------------------

$('.accordion').click(function(e) {
  e.preventDefault();

  if ($(this).next().hasClass('show')) {
    $(this).css({"border-bottom": "none"});
    $(this).next().removeClass('show');
    $(this).next().slideUp(350);
  } else {
    $.each($(this).parent().parent().find('div .accordion'), function(i, item) {
      $(item).css({"border-bottom": "none"});
    });
    $(this).parent().parent().find('div .accordion-inner').removeClass('show');
    $(this).parent().parent().find('div .accordion-inner').slideUp(350);
    $(this).css({"border-bottom": "1px solid #ff0000"});
    $(this).next().toggleClass('show');
    $(this).next().slideToggle(350);
  }
});
