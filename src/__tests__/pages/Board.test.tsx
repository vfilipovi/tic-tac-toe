import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Board from "../../pages/Board";
import { authenticatedGet } from "../../auth/AuthenticatedRequest";
import { API_URL } from "../../auth/AuthService";

interface LocationStateProps {
  id: number;
}

jest.mock("../../auth/AuthenticatedRequest");

const mockedAuthenticatedGet = authenticatedGet as jest.Mock;

describe("Board component", () => {
  const mockLocationState: LocationStateProps = { id: 1 };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("fetches game data on mount", async () => {
    const mockedGameData = {
      status: "open",
      first_player: { id: 1, username: "Perica" },
      second_player: { id: 2, username: "Jurica" },
      board: [
        [null, null],
        [null, null],
      ],
    };
    mockedAuthenticatedGet.mockResolvedValueOnce(mockedGameData);

    const { getByText } = render(
      <MemoryRouter
        initialEntries={[{ pathname: "/board", state: mockLocationState }]}
        initialIndex={0}
      >
        <Routes>
          <Route path="/board" element={<Board />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockedAuthenticatedGet).toHaveBeenCalledWith(
        `${API_URL}/games/${mockLocationState.id}/`
      );

      const pericaEl = getByText(
        `Player 1: ${mockedGameData.first_player.username} (X)`
      );
      const juricaEl = getByText(
        `Player 2: ${mockedGameData.second_player.username} (O)`
      );

      expect(pericaEl).toBeInTheDocument();
      expect(juricaEl).toBeInTheDocument();
    });
  });
});
