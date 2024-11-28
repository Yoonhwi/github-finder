export const userController = new UserController();

(function initialize() {
  const searchBtn = document.querySelector(".search-button");
  const searchInput = document.getElementById("search-input");

  searchBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    if (searchInput.value === "") return;
    await userController.searchAllUsers(searchInput.value);
    document.dispatchEvent(new CustomEvent("usersUpdated"));

    console.log("all users : ", userController.users);
  });
})();
