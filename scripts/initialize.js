import { UserController } from "./user-controller.js";
import { DomController } from "./dom-controller.js";

export const userController = new UserController();
export const domController = new DomController(userController);

(function initialize() {
  userController.domController = domController;
  domController.init();
  const searchBtn = document.querySelector(".search-button");
  const searchInput = document.getElementById("search-input");
  const darkModeBtn = document.querySelector(".darkmode-btn");

  const theme = localStorage.getItem("theme");
  theme === "dark" ? document.documentElement.classList.add("dark") : null;
  darkModeBtn.addEventListener("click", () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  });

  searchBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    if (searchInput.value === "") return;
    await userController.searchAllUsers(searchInput.value);
    document.dispatchEvent(new CustomEvent("usersUpdated"));
  });
})();
