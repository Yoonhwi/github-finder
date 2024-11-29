class Api {
  static instance = null;

  constructor() {
    this.graphqlURL = "https://api.github.com/graphql";
    this.baseURL = "https://api.github.com";
    this.API_TOKEN = import.meta.env.VITE_API_TOKEN;
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Api();
    }
    return this.instance;
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

export class UserApi {
  domController = null;
  users = null;
  repos = null;
  currentUser = null;

  constructor() {
    this.api = Api.getInstance();
  }

  searchAllUsers = async (userId) => {
    const response = await this.api.getUsers(userId);
    this.users = response.items.length ? response.items : null;
    return this.users;
  };

  searchAllRepos = async (userId) => {
    const response = await this.api.getUserRepos(userId);
    this.repos = response;
    return this.repos;
  };

  searchDetailUser = async (userId) => {
    const response = await this.api.getDetailUser(userId);
    this.currentUser = response;
    return this.currentUser;
  };
}
