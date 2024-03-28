import "@testing-library/jest-dom";
import { authenticatedGet } from "../../auth/AuthenticatedRequest";
import GamesList from "../../pages/GamesList";
import { render, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

jest.mock("../../auth/AuthenticatedRequest");

describe("GamesList component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders game cards after fetching games", async () => {
    (authenticatedGet as jest.Mock).mockResolvedValueOnce({
      results: [
        {
          id: 1,
          created: "2024-03-09",
          status: "open",
          winner: null,
          first_player: { id: 1, username: "Player1" },
          second_player: { id: 2, username: "Player2" },
          board: [
            [null, null, null],
            [null, null, null],
            [null, null, null],
          ],
        },
      ],
      count: 1,
    });
    const { getByText } = render(
      <BrowserRouter>
        <GamesList />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(authenticatedGet).toHaveBeenCalledTimes(1);
      expect(getByText("Game: Tic Tac Toe - 1")).toBeInTheDocument();
    });
  });
});
