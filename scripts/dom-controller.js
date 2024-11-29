import { userController } from "./initialize.js";
import { userTags, userDes, repoTags } from "./constant.js";
import { formatDate } from "./utils.js";

export default class DomController {
  constructor() {
    this.userController = userController;
  }

  init() {
    this.detailUserSection = document.querySelector(".detail-user-section");
    this.profileSection = document.querySelector(".profile-section");
    this.detailUserInfo = document.querySelector(".user-info-flex");
    this.detailUserRepos = document.querySelector(".user-repo-flex");

    if (
      !this.profileSection ||
      !this.detailUserInfo ||
      !this.detailUserRepos ||
      !this.detailUserSection
    ) {
      console.error("None Element Error");
      return;
    }
  }

  renderUsers() {
    while (this.profileSection.firstChild) {
      this.profileSection.removeChild(this.profileSection.firstChild);
    }

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
    while (this.detailUserInfo.firstChild) {
      this.detailUserInfo.removeChild(this.detailUserInfo.firstChild);
    }

    const user = this.userController.currentUser;

    const img = document.createElement("img");
    img.src = user.avatar_url;

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
    this.detailUserInfo.appendChild(img);
    this.detailUserInfo.appendChild(userInfoRight);
  }

  renderDetailRepos() {
    while (this.detailUserRepos.firstChild) {
      this.detailUserRepos.removeChild(this.detailUserRepos.firstChild);
    }

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

    this.detailUserRepos.appendChild(fragement);
  }

  scrollToDetail() {
    const offsetTop = this.detailUserSection.offsetTop;
    window.scrollTo({
      top: offsetTop - 60,
      behavior: "smooth",
    });
  }
}
