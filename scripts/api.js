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
  users = null;
  repos = null;
  commits = null;
  currentUser = null;
  userCounter = null;

  constructor() {
    this.api = new Api();
  }

  async searchAllUsers(userId) {
    const response = await this.api.getUsers(userId);
    this.userCounter = response.total_count;
    this.users = response.items.length ? response.items : null;

    return this.users;
  }

  async searchAllRepos(userId) {
    const response = await this.api.getUserRepos(userId);
    this.repos = response;
    return this.repos;
  }

  async searchDetailUser(userId) {
    const response = await this.api.getDetailUser(userId);
    this.currentUser = response;
    return this.currentUser;
  }

  async searchCommits(userId) {
    const response = await this.api.getCommits(userId);
    this.commits = response;
    return this.commits;
  }
}
