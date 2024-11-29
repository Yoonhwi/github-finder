import { UserApi } from "./api.js";
import { DomRenderer } from "./dom-renderer.js";
import {
  UserCard,
  UserDetailImg,
  UserDetailTag,
  UserDetailDescription,
  UserDetailCommitImg,
} from "./components.js";
import { withWrapping, withErrorHandle } from "./utils.js";

export const userApi = new UserApi();
export const domRenderer = new DomRenderer();

const searchAllUsers = withErrorHandle(
  withWrapping(
    userApi.searchAllUsers,
    domRenderer.showSearchUsersLoading,
    domRenderer.hideSearchUsersLoading
  ),
  (error) => {
    alert(error.message);
    domRenderer.hideSearchUsersLoading();
  }
);

const searchDetailUser = withErrorHandle(
  withWrapping(
    userApi.searchDetailUser,
    () => {
      domRenderer.showDetailUserLoading();
      domRenderer.showDetailUserReposLoading();
    },
    domRenderer.hideDetailUserLoading
  ),
  (error) => {
    alert(error.message);
    domRenderer.hideDetailUserLoading();
  }
);

const searchAllRepos = withErrorHandle(
  withWrapping(
    userApi.searchAllRepos,
    null,
    domRenderer.hideDetailUserReposLoading
  ),
  (error) => {
    alert(error.message);
    domRenderer.hideDetailUserReposLoading();
  }
);

(function initialize() {
  userApi.domController = domRenderer;
  domRenderer.init();

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

    const users = await searchAllUsers(searchInput.value);

    const userProfiles = users?.map(
      (user) =>
        new UserCard(user, async () => {
          domRenderer.deleteUserInfo();
          domRenderer.deleteCommitImg();
          domRenderer.deleteUserRepos();
          const detailUser = await searchDetailUser(user.login);
          const repos = await searchAllRepos(user.login);
          domRenderer.renderDetailUser(
            new UserDetailImg(detailUser),
            new UserDetailTag(detailUser),
            new UserDetailDescription(detailUser),
            new UserDetailCommitImg(detailUser)
          );
          domRenderer.renderDetailRepos(repos);
          domRenderer.scrollToDetail();
        })
    );

    domRenderer.renderUsers(userProfiles);
  });
})();
