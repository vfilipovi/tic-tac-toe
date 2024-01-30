import axios, { AxiosError, AxiosInstance } from "axios";

const getToken = (): string | null => {
  return localStorage.getItem("token");
};

// Add auth headers to axios req.
const createAuthenticatedInstance = (): AxiosInstance => {
  const instance: AxiosInstance = axios.create();

  instance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });
  return instance;
};

export const authenticatedAxios = createAuthenticatedInstance();

// POST with auth headers
export const authenticatedPost = async (url: string, data: unknown) => {
  try {
    const response = await authenticatedAxios.post(url, data);
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err.response?.data;
  }
};

// GET with auth headers
export const authenticatedGet = async (url: string) => {
  try {
    const response = await authenticatedAxios.get(url);
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err.response?.data;
  }
};
