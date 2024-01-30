import axios, { AxiosError } from "axios";
import { authenticatedPost } from "./AuthenticatedRequest";

export const API_URL = "https://tictactoe.aboutdream.io";

interface LoginResponse {
  token: string;
  username: string;
  id: number;
}

const removeUserFromLocalStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("id");
};

export const login = async (
  enteredUsername: string,
  enteredPassword: string
): Promise<boolean | unknown> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/login/`, {
      username: enteredUsername,
      password: enteredPassword,
    });
    const { token, username, id } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("id", id.toString());
    return false;
  } catch (error) {
    const err = error as AxiosError;
    return err.response?.data;
  }
};

export const registerUser = async (
  enteredUsername: string,
  enteredPassword: string
): Promise<boolean | unknown> => {
  try {
    await axios.post(`${API_URL}/register/`, {
      username: enteredUsername,
      password: enteredPassword,
    });
    return false;
  } catch (error) {
    const err = error as AxiosError;
    return err.response?.data;
  }
};

export const isLoggedIn = (): boolean => {
  const token = localStorage.getItem("token");
  return !!token;
};

export const logout = (): Promise<void | AxiosError> => {
  return new Promise((resolve, reject) => {
    authenticatedPost(`${API_URL}/logout/`, null)
      .then(() => {
        removeUserFromLocalStorage();
        resolve();
      })
      .catch((error) => {
        removeUserFromLocalStorage();
        reject(error);
      });
  });
};
