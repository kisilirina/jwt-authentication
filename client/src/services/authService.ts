import $api from "../http/http"
import { AxiosResponse } from 'axios';
import { AuthResponse } from "../models/response/AuthResponse";

export const login = async (email: string, password: string): Promise<AxiosResponse<AuthResponse>> => {
  return $api.post<AuthResponse>('/signin', { email, password })

}

export const registration = async (email: string, password: string): Promise<AxiosResponse<AuthResponse>> => {

  return $api.post<AuthResponse>('/signup', { email, password });
}

export const logout = async (): Promise<void> => {
  return $api.post('/signout')
}