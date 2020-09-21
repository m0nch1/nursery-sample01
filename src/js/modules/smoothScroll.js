import smoothscroll from "smoothscroll-polyfill";
import "lazysizes";
import "lazysizes/plugins/parent-fit/ls.parent-fit";

export default function smoothScroll() {
  smoothscroll.polyfill();

  const spMenus = document.querySelectorAll(".nav__list--sp a");
  const spToggleCheckbox = document.querySelector("input#nav-input");

  spMenus.forEach((list) => {
    list.addEventListener("click", (e) => {
      spToggleCheckbox.checked = false;
    });
  });

  const scrollFunction = () => {
    const this_y = window.pageYOffset;
    const toTop = document.querySelector(".to-top");
    if (this_y > window.innerHeight - 56) {
      toTop.classList.add("active");
    } else {
      toTop.classList.remove("active");
    }
  };
  window.onscroll = () => {
    scrollFunction();
  };

  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!target.classList.contains("js-smooth-scroll")) return;
    e.preventDefault();
    const targetId = target.hash;
    document.querySelector(targetId).scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}
