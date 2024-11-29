import DomController from "./dom-controller.js";

const domController = new DomController();
domController.init();

(function dom() {
  document.addEventListener("usersUpdated", () => domController.renderUsers());
  document.addEventListener("userDetailUpdated", () => {
    domController.renderDetailUser();
    domController.renderDetailRepos();
    domController.scrollToDetail();
  });
})();
