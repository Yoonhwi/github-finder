import { userController } from "./initialize.js";

(function dom() {
  const profileSection = document.querySelector(".profile-section");

  document.addEventListener("usersUpdated", () => {
    while (profileSection.firstChild) {
      profileSection.removeChild(profileSection.firstChild);
    }

    if (!userController.users || !userController.users.length) {
      const el = document.createElement("p");
      el.textContent = "No users found!";
      profileSection.appendChild(el);
      profileSection.classList.add("flex");
      return;
    }

    profileSection.classList.remove("flex");
    const fragement = document.createDocumentFragment();
    userController.users.forEach((user) => {
      const el = document.createElement("div");
      el.classList.add("profile-card");
      const img = document.createElement("img");
      img.src = user.avatar_url;
      img.addEventListener("click", async () => {
        const current = await userController.searchDetailUser(user.login);
        userController.currentUser = current;
      });
      const name = document.createElement("span");
      name.textContent = user.login;

      el.appendChild(img);
      el.appendChild(name);
      fragement.appendChild(el);
    });
    profileSection.appendChild(fragement);
  });
})();
