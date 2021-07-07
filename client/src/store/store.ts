import axios from "axios";
import { makeAutoObservable } from "mobx";
import { API_URL } from "../http/http";
import { IUser } from "../models/IUser";
import { AuthResponse } from "../models/response/AuthResponse";
import { login, logout, registration } from "../services/authService";

export default class Store {
  user = {} as IUser;
  isAuth = false;
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  setAuth(bool: boolean) {
    this.isAuth = bool;
  }

  setUser(user: IUser) {
    this.user = user;
  }

  setLoading(bool: boolean) {
    this.isLoading = bool;
  }

  async login(email: string, password: string) {
    try {
      const response = await login(email, password);
      console.log(response);
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (error) {
      console.log(error.response?.data?.message)
    }
  }

  async registration(email: string, password: string) {
    try {
      const response = await registration(email, password);
      console.log(response);
      localStorage.setItem('token', response.data.accessToken)
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (error) {
      console.log(error.response?.data?.message)
    }
  }

  async logout() {
    try {
      await logout();
      localStorage.removeItem('token');
      this.setAuth(false);
      this.setUser({} as IUser);
    } catch (error) {
      console.log(error.response?.data?.message)
    }
  }

  async checkAuth() {
    this.setLoading(true);
    try {
      const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, { withCredentials: true });
      console.log(response);
      localStorage.setItem('token', response.data.accessToken)
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (error) {
      console.log(error.response?.data?.message)
    } finally {
      this.setLoading(false);
    }
  }
}