class Api {
  constructor() {
    this.graphqlURL = "https://api.github.com/graphql";
    this.baseURL = "https://api.github.com";
    this.API_TOKEN = import.meta.env.VITE_API_TOKEN;
  }

  async getUsers(userId) {
    try {
      const response = await fetch(
        `${this.baseURL}/search/users?q=${userId}&client_id=undefined&client_secret=undefined`,
        {
          headers: {
            Authorization: `Bearer ${this.API_TOKEN}`,
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Api Error getUsers", error);
    }
  }

  async getUserRepos(userId) {
    try {
      const response = await fetch(`${this.baseURL}/users/${userId}/repos`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Api Error getUserRepos", error);
    }
  }

  async getCommits(userId) {
    try {
      const response = await fetch(`${this.baseURL}/${userId}/events`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Api Error getCommits", error);
    }
  }

  async getDetailUser(userId) {
    try {
      const response = await fetch(`${this.baseURL}/users/${userId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Api Error getDetailUser", error);
    }
  }
}

export class UserController {
  domController = null;
  users = null;
  repos = null;
  commits = null;
  currentUser = null;
  userCounter = null;

  constructor() {
    this.api = new Api();
  }

  async searchAllUsers(userId) {
    this.domController.showSearchUsersLoading();
    const response = await this.api.getUsers(userId);
    this.userCounter = response.total_count;
    this.users = response.items.length ? response.items : null;
    this.domController.hideSearchUsersLoading();

    return this.users;
  }

  async searchAllRepos(userId) {
    const response = await this.api.getUserRepos(userId);
    this.repos = response;
    this.domController.hideDetailUserReposLoading();
    return this.repos;
  }

  async searchDetailUser(userId) {
    this.domController.showDetailUserLoading();
    this.domController.showDetailUserReposLoading();
    const response = await this.api.getDetailUser(userId);
    this.currentUser = response;
    this.domController.hideDetailUserLoading();
    return this.currentUser;
  }

  async searchCommits(userId) {
    const response = await this.api.getCommits(userId);
    this.commits = response;
    return this.commits;
  }
}
