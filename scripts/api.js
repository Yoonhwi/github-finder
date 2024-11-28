class Api {
  constructor() {
    this.baseURL = "https://api.github.com/graphql";
    this.API_TOKEN = import.meta.env.VITE_API_TOKEN;
  }
  async getUsers(userId) {
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.API_TOKEN}`,
        },
        body: JSON.stringify({
          query:`query searchUsers($userId: String!) { search(query: "$userId is:user is:active", type: USER, first: 30) { userCount edges { node { ... on User { login avatarUrl } } } } }`,
          variables: JSON.stringify({ userId  
        }),
        }),
      });
  
      const { data, errors } = await response.json();

      const filteredUsers = data.search.edges.filter(
        edge => edge.node && edge.node.login && edge.node.avatarUrl
      );

      console.log("filteredUsers", filteredUsers);
  
      if (errors) {
        console.error("GraphQL Errors", errors);
        return null;
      }
  
      return {...data.search , edges:filteredUsers};
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
  repose = null;
  commits = null;
  currentUser = null;
  userCounter = null;

  constructor() {
    this.api = new Api();
  }

  async searchAllUsers(userId) {
    const response = await this.api.getUsers(userId);
    console.log("response", response);
    this.userCounter = response.userCounter;
    this.users = response.edges.length ? response.edges : null;
    console.log("pages", this.userCounter);
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
