import { fireEvent, render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import StartPage from "../../pages/StartPage";
import { Game } from "../../pages/GamesList";
import { isLoggedIn } from "../../auth/AuthService";
import { createNewGame } from "../../components/utilFunctions/gameRequestsHelper";

jest.mock("../../auth/AuthService");
jest.mock("../../components/utilFunctions/gameRequestsHelper");

const mockUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUsedNavigate,
}));

describe("StartPage Component", () => {
  beforeEach(() => {
    jest.mocked(isLoggedIn).mockReturnValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders StartPage when logged in", () => {
    const { getByText } = render(<StartPage />);
    expect(getByText("Browse all games")).toBeInTheDocument();
    expect(getByText("New game")).toBeInTheDocument();
  });

  test('renders "Please register or sign-in !" when not logged in', () => {
    jest.mocked(isLoggedIn).mockReturnValue(false);
    const { getByText } = render(<StartPage />);
    expect(getByText("Please register or sign-in !")).toBeInTheDocument();
  });

  test("redirects to games page on browse all games button click", () => {
    const { getByText } = render(<StartPage />);
    fireEvent.click(getByText("Browse all games"));
  });

  test("creates new game on new game button click", async () => {
    const mockedGame: Game = {
      id: 123,
      created: "2024-03-09T12:00:00",
      status: "finished",
      winner: { id: 2, username: "player2" },
      first_player: { id: 1, username: "player1" },
      second_player: { id: 2, username: "player2" },
      board: [
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ],
    };
    jest.mocked(createNewGame).mockReturnValue(Promise.resolve(mockedGame));
    const { getByText } = render(<StartPage />);
    fireEvent.click(getByText("New game"));
    expect(getByText("New game")).toBeDisabled(); // Assert button is disabled during async call
    await waitFor(() => {
      expect(createNewGame).toHaveBeenCalledTimes(1); // Ensure createNewGame function was called
    });
  });

  test("shows error modal if createNewGame fails", async () => {
    const errorMessage = "An error occurred";
    jest
      .mocked(createNewGame)
      .mockRejectedValue({ errors: [{ message: errorMessage }] });
    const { getByText, findByText } = render(<StartPage />);
    fireEvent.click(getByText("New game"));
    await waitFor(() => {
      expect(createNewGame).toHaveBeenCalledTimes(1);
    });
    const errorModal = await findByText(errorMessage);
    expect(errorModal).toBeInTheDocument();
  });
});
