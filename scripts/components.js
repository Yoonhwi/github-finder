import { userTags, userDes, repoTags } from "./constant";
import { formatDate } from "./utils";

export class UserCard {
  user = null;
  onClick = null;

  constructor(user, onClick) {
    this.user = user;
    this.onClick = onClick;
  }

  render() {
    const el = document.createElement("div");
    el.classList.add("profile-card");
    const img = document.createElement("img");
    img.src = this.user.avatar_url;

    img.addEventListener("click", this.onClick);

    const name = document.createElement("span");
    name.textContent = this.user.login;

    el.appendChild(img);
    el.appendChild(name);
    return el;
  }
}

export class UserDetailTag {
  user = null;
  constructor(user) {
    this.user = user;
  }

  render() {
    const el = document.createElement("div");
    el.classList.add("user-tags");

    userTags.forEach((tag) => {
      const tagEl = document.createElement("span");
      tagEl.classList.add("user-tag");
      const key = tag.toLowerCase().replace(/ /g, "_");
      const tagContent = this.user[key];
      tagEl.textContent = `${tag} : ${tagContent}`;

      el.appendChild(tagEl);
    });
    return el;
  }
}

export class UserDetailDescription {
  user = null;
  constructor(user) {
    this.user = user;
  }

  render() {
    const el = document.createElement("div");
    el.classList.add("user-description");

    Object.entries(userDes).forEach(([label, key]) => {
      const desContent =
        label === "Member Since" ? formatDate(this.user[key]) : this.user[key];

      if (label === "Blog") {
        if (desContent === null || desContent === "") {
          const desEl = document.createElement("p");
          desEl.textContent = `${label} : ${desContent}`;
          el.appendChild(desEl);
        } else {
          const desEl = document.createElement("a");
          desEl.target = "_blank";
          desEl.textContent = `${label} : ${desContent}`;
          desEl.href = desContent;
          el.appendChild(desEl);
        }
        return;
      }

      const desEl = document.createElement("p");
      desEl.textContent = `${label} : ${desContent}`;
      el.appendChild(desEl);
    });
    return el;
  }
}

export class UserDetailImg {
  user = null;
  constructor(user) {
    this.user = user;
  }

  render() {
    const el = document.createElement("img");
    el.classList.add("user-img");
    el.src = this.user.avatar_url;

    el.addEventListener("click", () => {
      window.open(this.user.html_url, "_blank");
    });
    return el;
  }
}

export class UserDetailCommitImg {
  user = null;
  constructor(user) {
    this.user = user;
  }

  render() {
    const el = document.createElement("img");
    el.classList.add("commit-img");
    el.src = `https://ghchart.rshah.org/328049/${this.user.login}`;
    return el;
  }
}

export class UserDetailRepos {
  repos = null;
  constructor(repos) {
    this.repos = repos;
  }

  render() {
    const fragement = document.createDocumentFragment();
    this.repos.forEach((repo) => {
      const el = document.createElement("div");
      el.classList.add("user-repo");

      const repoName = document.createElement("a");
      repoName.classList.add("repo-name");
      repoName.textContent = repo.name;
      repoName.href = repo.html_url;
      repoName.target = "_blank";

      el.appendChild(repoName);

      const repoInfo = document.createElement("div");
      repoInfo.classList.add("repo-info");

      Object.entries(repoTags).forEach(([label, key]) => {
        const infoEl = document.createElement("span");
        infoEl.textContent = `${label} : ${repo[key]}`;
        repoInfo.appendChild(infoEl);
      });

      el.appendChild(repoInfo);
      fragement.appendChild(el);
    });

    return fragement;
  }
}
