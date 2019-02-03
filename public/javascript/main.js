$(document).ready(function() {
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
  var slide = $("#slideProdotti").lightSlider({
    item: 2,
    slideMove: 1,

    enableDrag: true,
    controls: true,
    pager: false,

    addClass: "center-thumbs",
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
  $(".sidebarBtn").click(function() {
    $(".sidebar").toggleClass("active");
    $(".sidebarBtn").toggleClass("toggle");
    $(".homepage-banner").toggleClass("offMargin");
    console.log(this);
  });
  $(".sidebarBtn").on("touchstart", function() {
    $(".sidebar").toggleClass("active");
    $(".sidebarBtn").toggleClass("toggle");
    $(".homepage-banner").toggleClass("offMargin");
  });
});
