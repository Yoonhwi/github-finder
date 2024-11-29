import { UserDetailRepos } from "./components.js";
import { removeElChild } from "./utils.js";

export class DomRenderer {
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

  renderUsers = (userCards) => {
    this.deleteUsers();

    if (!userCards || !userCards?.length) {
      const el = document.createElement("p");
      el.textContent = "No users found!";
      this.profileSection.appendChild(el);
      this.profileSection.classList.add("flex");
      return;
    }

    this.profileSection.classList.remove("flex");
    const fragement = document.createDocumentFragment();

    userCards.forEach((userCard) => {
      const el = userCard.render();
      fragement.appendChild(el);
    });

    this.profileSection.appendChild(fragement);
  };

  renderDetailUser = (userImg, userTags, userDes, commitImg) => {
    const userInfoRight = document.createElement("div");
    userInfoRight.classList.add("user-info-right");

    const img = userImg.render();
    const userTagsEl = userTags.render();
    const userDesEl = userDes.render();
    const commitEl = commitImg.render();

    userInfoRight.appendChild(userTagsEl);
    userInfoRight.appendChild(userDesEl);

    this.userInfoEl.appendChild(img);
    this.userInfoEl.appendChild(userInfoRight);

    this.detailUserInfo.appendChild(commitEl);
  };

  renderDetailRepos = (repos) => {
    this.deleteUserRepos();

    if (!repos || !repos.length) {
      const el = document.createElement("p");
      el.textContent = "Empty Repositories";
      this.userRepoEl.appendChild(el);
      return;
    }

    const fragement = new UserDetailRepos(repos).render();
    this.userRepoEl.appendChild(fragement);
  };

  scrollToDetail() {
    const offsetTop = this.detailUserSection.offsetTop;
    window.scrollTo({
      top: offsetTop - 60,
      behavior: "smooth",
    });
  }

  createSpinner(parentEl) {
    const boxEl = document.createElement("div");
    boxEl.classList.add("spinner-box");
    const spinnerEl = document.createElement("div");
    spinnerEl.classList.add("spinner");

    boxEl.appendChild(spinnerEl);
    parentEl.appendChild(boxEl);
  }

  showSearchUsersLoading = () => {
    removeElChild(this.profileSection);
    this.createSpinner(this.profileSection);
    this.profileSection.classList.add("loading");
  };

  hideSearchUsersLoading = () => {
    removeElChild(this.profileSection);
    this.profileSection.classList.remove("loading");
  };

  showDetailUserLoading = () => {
    removeElChild(this.userInfoEl);
    this.createSpinner(this.userInfoEl);
  };

  hideDetailUserLoading = () => {
    removeElChild(this.userInfoEl);
  };

  showDetailUserReposLoading = () => {
    removeElChild(this.userRepoEl);
    this.createSpinner(this.userRepoEl);
  };

  hideDetailUserReposLoading = () => {
    removeElChild(this.userRepoEl);
  };

  deleteCommitImg() {
    const existImg = this.detailUserInfo.querySelector(".commit-img");
    if (existImg) {
      this.detailUserInfo.removeChild(existImg);
    }
  }

  deleteUserRepos() {
    removeElChild(this.userRepoEl);
  }

  deleteUserInfo() {
    removeElChild(this.userInfoEl);
  }

  deleteUsers() {
    removeElChild(this.profileSection);
  }
}
