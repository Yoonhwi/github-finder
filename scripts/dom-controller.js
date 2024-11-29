import { userTags, userDes, repoTags } from "./constant.js";
import { formatDate } from "./utils.js";

export class DomController {
  constructor(userController) {
    this.userController = userController;
  }

  init() {
    this.detailUserSection = document.querySelector(".detail-user-section");
    this.detailUserInfo = document.querySelector(".detail-user-info");
    this.profileSection = document.querySelector(".profile-section");
    this.userInfoEl = document.querySelector(".user-info-flex");
    this.userRepoEl = document.querySelector(".user-repo-flex");

    if (
      !this.profileSection ||
      !this.userInfoEl ||
      !this.userRepoEl ||
      !this.detailUserSection
    ) {
      console.error("None Element Error");
      return;
    }
  }

  renderUsers() {
    this.deleteUsers();

    if (!this.userController.users || !this.userController.users.length) {
      const el = document.createElement("p");
      el.textContent = "No users found!";
      this.profileSection.appendChild(el);
      this.profileSection.classList.add("flex");
      return;
    }

    this.profileSection.classList.remove("flex");
    const fragement = document.createDocumentFragment();

    this.userController.users.forEach((user) => {
      const el = document.createElement("div");
      el.classList.add("profile-card");
      const img = document.createElement("img");
      img.src = user.avatar_url;

      img.addEventListener("click", async () => {
        this.deleteUserInfo();
        this.deleteCommitImg();
        this.deleteUserRepos();
        await this.userController.searchDetailUser(user.login);
        await this.userController.searchAllRepos(user.login);

        document.dispatchEvent(new CustomEvent("userDetailUpdated"));
      });

      const name = document.createElement("span");
      name.textContent = user.login;

      el.appendChild(img);
      el.appendChild(name);
      fragement.appendChild(el);
    });
    this.profileSection.appendChild(fragement);
  }

  renderDetailUser() {
    const user = this.userController.currentUser;

    const img = document.createElement("img");
    img.classList.add("user-img");
    img.src = user.avatar_url;
    img.addEventListener("click", () => {
      window.open(user.html_url, "_blank");
    });

    const userInfoRight = document.createElement("div");
    userInfoRight.classList.add("user-info-right");

    const userTagsEl = document.createElement("div");
    userTagsEl.classList.add("user-tags");

    userTags.forEach((tag) => {
      const tagEl = document.createElement("span");
      tagEl.classList.add("user-tag");
      const key = tag.toLowerCase().replace(/ /g, "_");
      const tagContent = user[key];
      tagEl.textContent = `${tag} : ${tagContent}`;

      userTagsEl.appendChild(tagEl);
    });

    const userDescription = document.createElement("div");
    userDescription.classList.add("user-description");

    Object.entries(userDes).forEach(([label, key]) => {
      const desContent =
        label === "Member Since" ? formatDate(user[key]) : user[key];

      if (label === "Blog") {
        if (desContent === null || desContent === "") {
          const desEl = document.createElement("p");
          desEl.textContent = `${label} : ${desContent}`;
          userDescription.appendChild(desEl);
        } else {
          const desEl = document.createElement("a");
          desEl.target = "_blank";
          desEl.textContent = `${label} : ${desContent}`;
          desEl.href = desContent;
          userDescription.appendChild(desEl);
        }
        return;
      }

      const desEl = document.createElement("p");
      desEl.textContent = `${label} : ${desContent}`;
      userDescription.appendChild(desEl);
    });

    userInfoRight.appendChild(userTagsEl);
    userInfoRight.appendChild(userDescription);
    this.userInfoEl.appendChild(img);
    this.userInfoEl.appendChild(userInfoRight);

    const commitImg = document.createElement("img");
    commitImg.classList.add("commit-img");
    commitImg.src = `https://ghchart.rshah.org/328049/${user.login}`;

    this.detailUserInfo.appendChild(commitImg);
  }

  renderDetailRepos() {
    this.deleteUserRepos();
    const repos = this.userController.repos;

    const fragement = document.createDocumentFragment();
    repos.forEach((repo) => {
      const repoEl = document.createElement("div");
      repoEl.classList.add("user-repo");

      const repoName = document.createElement("a");
      repoName.classList.add("repo-name");
      repoName.textContent = repo.name;
      repoName.href = repo.html_url;
      repoName.target = "_blank";

      repoEl.appendChild(repoName);

      const repoInfo = document.createElement("div");
      repoInfo.classList.add("repo-info");

      Object.entries(repoTags).forEach(([label, key]) => {
        const infoEl = document.createElement("span");
        infoEl.textContent = `${label} : ${repo[key]}`;
        repoInfo.appendChild(infoEl);
      });

      repoEl.appendChild(repoInfo);
      fragement.appendChild(repoEl);
    });

    this.userRepoEl.appendChild(fragement);
  }

  scrollToDetail() {
    const offsetTop = this.detailUserSection.offsetTop;
    window.scrollTo({
      top: offsetTop - 60,
      behavior: "smooth",
    });
  }

  createSpinner() {
    const boxEl = document.createElement("div");
    boxEl.classList.add("spinner-box");
    const spinnerEl = document.createElement("div");
    spinnerEl.classList.add("spinner");

    boxEl.appendChild(spinnerEl);
    return boxEl;
  }

  showSearchUsersLoading() {
    while (this.profileSection.firstChild) {
      this.profileSection.removeChild(this.profileSection.firstChild);
    }
    const spinnerEl = this.createSpinner();
    this.profileSection.appendChild(spinnerEl);
    this.profileSection.classList.add("loading");
  }

  hideSearchUsersLoading() {
    while (this.profileSection.firstChild) {
      this.profileSection.removeChild(this.profileSection.firstChild);
    }
    this.profileSection.classList.remove("loading");
  }

  showDetailUserLoading() {
    while (this.userInfoEl.firstChild) {
      this.userInfoEl.removeChild(this.userInfoEl.firstChild);
    }

    const spinnerEl = this.createSpinner();
    this.userInfoEl.appendChild(spinnerEl);
  }

  hideDetailUserLoading() {
    while (this.userInfoEl.firstChild) {
      this.userInfoEl.removeChild(this.userInfoEl.firstChild);
    }
  }

  showDetailUserReposLoading() {
    while (this.userRepoEl.firstChild) {
      this.userRepoEl.removeChild(this.userRepoEl.firstChild);
    }

    const spinnerEl = this.createSpinner();
    this.userRepoEl.appendChild(spinnerEl);
  }

  hideDetailUserReposLoading() {
    while (this.userRepoEl.firstChild) {
      this.userRepoEl.removeChild(this.userRepoEl.firstChild);
    }
  }

  deleteCommitImg() {
    const existImg = this.detailUserInfo.querySelector(".commit-img");
    if (existImg) {
      this.detailUserInfo.removeChild(existImg);
    }
  }

  deleteUserRepos() {
    while (this.userRepoEl.firstChild) {
      this.userRepoEl.removeChild(this.userRepoEl.firstChild);
    }
  }

  deleteUserInfo() {
    while (this.userInfoEl.firstChild) {
      this.userInfoEl.removeChild(this.userInfoEl.firstChild);
    }
  }

  deleteUsers() {
    while (this.profileSection.firstChild) {
      this.profileSection.removeChild(this.profileSection.firstChild);
    }
  }
}
