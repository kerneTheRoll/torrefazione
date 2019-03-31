$(document).ready(function() {
  new WOW().init();
  validaContatti();
  jeoquery.defaultData.userName = "ladolcevia";

  $("#country").jeoCountrySelect();

  $("#postalCode").jeoPostalCodeLookup({
    countryInput: $("#country"),
    target: $("#postalPlace")
  });
  $(".titolo-centro").hide();

  $(".blocco-paragrafo-ristorante").show();
  $(".titolo-sinistra,.titolo-sinistra-sm").click(function() {
    $(".titolo-sinistra").hide();
    $(".blocco-paragrafo-bar").fadeIn();
    $(".blocco-paragrafo-ristorante").hide();
    $(".blocco-paragrafo-ufficio").hide();
    $(".titolo-centro").show();
    $(".titolo-destra").show();
    $(".bubble").addClass("cambioFrecciaSinistra");

    $(".bubble").removeClass("cambioFrecciaDestra");
    $(this)
      .prev()
      .removeClass("blurred");
    $(".im-centro").addClass("blurred");
    $(".im-destra").addClass("blurred");
  });
  $(".titolo-centro,.titolo-centro-sm").click(function() {
    $(".blocco-paragrafo-bar").fadeOut();
    $(".titolo-centro").hide();
    $(".titolo-destra").show();
    $(".titolo-sinistra").show();
    $(".blocco-paragrafo-ristorante").fadeIn();
    $(".blocco-paragrafo-bar").hide();
    $(".blocco-paragrafo-ufficio").hide();
    $(".bubble").removeClass("cambioFrecciaSinistra");
    $(".bubble").removeClass("cambioFrecciaDestra");
    $(this)
      .prev()
      .removeClass("blurred");
    $(".im-sinistra").addClass("blurred");
    $(".im-destra").addClass("blurred");
  });
  $(".titolo-Destra,.titolo-Destra-sm").click(function() {
    $(".titolo-Destra").hide();
    $(".blocco-paragrafo-bar").fadeOut();
    $(".titolo-centro").show();
    $(".titolo-sinistra").show();
    $(".blocco-paragrafo-ristorante").hide();
    $(".blocco-paragrafo-bar").hide();
    $(".blocco-paragrafo-ufficio").fadeIn();
    $(".bubble").addClass("cambioFrecciaDestra");
    $(".bubble").removeClass("cambioFrecciaSinistra");

    $(this)
      .prev()
      .removeClass("blurred");
    $(".im-centro").addClass("blurred");
    $(".im-sinistra").addClass("blurred");
  });

  $("#image-slider").lightSlider({
    gallery: false,
    auto: true,
    item: 1,
    loop: true,
    slideMargin: 0,
    controls: false,
    enableDrag: false,
    currentPagerPosition: "left",
    pauseOnHover: true,
    pause: 6000
  });
  $("#slideContainer").lightSlider({
    auto: true,
    loop: true,
    pauseOnHover: true,
    item: 1,
    pager: false,
    controls: false,
    slideMargin: 0
  });
  var slide = $("#slideProdotti").lightSlider({
    item: 2,
    slideMove: 1,

    enableDrag: true,
    controls: true,
    pager: false,

    addClass: "center-thumbs",
    prevHtml:
      '<span class="custom-prev"><img src="../images/next.png"  style="transform:rotate(-180deg)"/></span>',
    nextHtml:
      '<span class="custom-prev"><img src="../images/next.png" /></span>',
    responsive: [
      {
        breakpoint: 767,

        settings: {
          item: 1,
          slideMove: 1
        }
      }
    ]
  });

  $(".language-selector select").on("change", function(event) {
    const $select = $(this);
    const $option = $select.find("option:selected", this);
    const url = $option.attr("href");
    window.location.href = url;
  });

  //profiles
  var PROFILE_COOKIE = "prismic.profile";
  function setProfile(profile) {
    window.Cookies.setItem(PROFILE_COOKIE, profile);
  }
  if (!Cookies.hasItem(PROFILE_COOKIE))
    setProfile(window.PrismicProfiles.default);

  $(".profile-selector select").on("change", function(event) {
    console.log(this);
    const $select = $(this);
    const $option = $select.find("option:selected", this);
    const profile = $option.attr("value");
    setProfile(profile);
    window.location.reload();
  });
  $("button.sidebarBtn").click(function() {
    $("div.sidebar").toggleClass("active");
    $(this).toggleClass("toggle");
    //$(".homepage-banner").toggleClass("offMargin");
    $(".animation-menu a,.animation-menu").toggleClass("animated  fadeInLeft");

    console.log(this);
  });
  $(".sidebarBtn").on("touchstart", function() {
    $(".sidebar").toggleClass("active");

    $(".sidebarBtn").toggleClass("toggle");
    // $(".homepage-banner").toggleClass("offMargin");
  });
  $(".chiudi").click(function() {
    $(".sidebar").toggleClass("active");
    //  $(".homepage-banner").toggleClass("offMargin");
    $(".sidebarBtn").toggleClass("toggle");
  });
  $(".chiudi").on("tochstart", function() {
    $(".sidebar").toggleClass("active");
  });
});
function validaContatti() {
  $("#contatta").validate({
    highlight: function(element) {
      $(element).addClass("is-invalid");
    },
    unhighlight: function(element) {
      $(element).removeClass("is-invalid");
    },
    rules: {
      nome: {
        required: true,
        minlength: 4
      },
      cognome: {
        required: true,
        minlength: 4
      },
      email: {
        required: true,
        email: true
      },

      country: {
        required: true
      },
      cap: {
        required: true
      },
      citta: {
        required: true,
        minlength: 2
      },
      telefono: {
        required: true,
        number: true
      }

      // qui va bene
    },

    messages: {
      nome: {
        required: "campo obbligatorio",
        minlength: "nome troppo corto, minimo 4 lettere"
      },

      cognome: {
        required: "campo obbligatorio",
        minlength: "cognome troppo corto, minimo 4 lettere",
        required: "Campo obbligatorio"
      },
      email: {
        required: "Campo obbligatorio",
        email: "Campo Obbligatorio"
      },
      country: {
        required: "Campo obbligatorio"
      },
      cap: {
        required: "Campo obbligatorio"
      },
      citta: {
        required: "Campo obbligatorio",
        minlength: "Campo obbligatorio"
      },
      telefono: {
        required: "Campo obbligatorio",
        number: "*Campo obbligatorio"
      },
      richiesta: {
        required: "scrivi un messaggio"
      }
    },
    submitHandler: function(form) {
      $("div.loading-none")
        .addClass("loading")
        .removeClass("loading-none");
      $.ajax({
        url: form.action,
        type: form.method,
        data: $(form).serialize(),
        success: function(response) {
          $("div.loading")
            .addClass("loading-none")
            .removeClass("loading");
          $(".info-email-generico")
            .show()
            .addClass("alert-success")
            .text(
              "Grazie! Messaggio correttamente inviato, sarai contattato a breve"
            );
        },
        error: function(response) {
          $("div.loading")
            .addClass("loading-none")
            .removeClass("loading");
          $(".info-email-generico")
            .show()
            .addClass("alert-danger")
            .text("Non siamo riusciti a inviare email, riprova più tardi");
        }
      });
    }
  });
}
