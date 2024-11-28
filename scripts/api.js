class Api {
  constructor() {
    this.baseURL = "https://api.github.com/graphql";
  }
  async getUsers(userId) {
    try {
      const response = await fetch(
        `${this.baseURL}/search/users?q=${encodeURIComponent(userId)}`,
        {
          headers: {
            Authorization: `Bearer `,
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

class UserController {
  users = null;
  repose = null;
  commits = null;
  currentUser = null;
  usersLength = null;

  constructor() {
    this.api = new Api();
  }

  async searchAllUsers(userId) {
    const response = await this.api.getUsers(userId);
    console.log("response", response);
    this.usersLength = response.total_count;
    this.users = response.items.length ? response.items : null;
    console.log("pages", this.pages);
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
