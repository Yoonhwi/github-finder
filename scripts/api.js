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
    const response = await fetch(
      `${this.baseURL}/search/users?q=${userId}&client_id=undefined&client_secret=undefined`,
      {
        headers: {
          Authorization: `Bearer ${this.API_TOKEN}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Get Users API Error");
    }
    const data = await response.json();
    return data;
  }

  async getUserRepos(userId) {
    const response = await fetch(`${this.baseURL}/users/${userId}/repos`, {
      headers: {
        Authorization: `Bearer ${this.API_TOKEN}`,
      },
    });
    if (!response.ok) {
      throw new Error("Get User Repos API Error");
    }
    const data = await response.json();
    return data;
  }

  async getDetailUser(userId) {
    const response = await fetch(`${this.baseURL}/users/${userId}`);
    if (!response.ok) {
      throw new Error("Get Detail User API Error");
    }
    const data = await response.json();
    return data;
  }
}

export class UserApi {
  constructor() {
    this.api = Api.getInstance();
  }

  searchAllUsers = async (userId) => {
    const response = await this.api.getUsers(userId);
    return response.items?.length ? response.items : null;
  };

  searchAllRepos = async (userId) => {
    return await this.api.getUserRepos(userId);
  };

  searchDetailUser = async (userId) => {
    return await this.api.getDetailUser(userId);
  };
}
