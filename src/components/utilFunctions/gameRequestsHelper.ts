import { AxiosError } from "axios";
import { API_URL } from "../../auth/AuthService";
import { authenticatedPost } from "../../auth/AuthenticatedRequest";
import { Game } from "../../pages/GamesList";

export const createNewGame = (): Promise<Game | AxiosError> => {
  return new Promise((resolve, reject) => {
    authenticatedPost(`${API_URL}/games/`, null)
      .then((response: Game) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const joinGame = (gameId: number): Promise<void | AxiosError> => {
  return new Promise((resolve, reject) => {
    authenticatedPost(`${API_URL}/games/${gameId}/join/`, null)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};
