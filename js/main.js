import Swiper, { Navigation, Pagination, EffectFade, Autoplay } from "swiper";
Swiper.use([Navigation, Pagination, EffectFade, Autoplay]);

const swiper = new Swiper(".swiper-container", {
  effect: "fade",
  direction: "vertical",
  loop: true,
  autoplay: {
    delay: 5000,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});
