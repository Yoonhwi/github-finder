import { domController } from "./initialize.js";

(function dom() {
  document.addEventListener("usersUpdated", () => domController.renderUsers());
  document.addEventListener("userDetailUpdated", () => {
    domController.renderDetailUser();
    domController.renderDetailRepos();
    domController.scrollToDetail();
  });
})();
