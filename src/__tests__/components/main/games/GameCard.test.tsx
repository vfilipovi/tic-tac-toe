import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import GameCard from "../../../../components/main/games/GameCard";
import { Game } from "../../../../pages/GamesList";

jest.mock("../../../../components/utilFunctions/gameRequestsHelper", () => ({
  joinGame: jest.fn().mockResolvedValue({}),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("GameCard component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const game: Game = {
    id: 123,
    created: "2024-03-09T12:00:00Z",
    status: "open",
    winner: { id: 456, username: "winner" },
    first_player: { id: 789, username: "player1" },
    second_player: { id: 101112, username: "player2" },
    board: [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ],
  };

  test("renders game card correctly", () => {
    const { getByText } = render(<GameCard {...game} />);

    expect(getByText(`Status: ${game.status}`)).toBeInTheDocument();
    expect(getByText(`Game: Tic Tac Toe - ${game.id}`)).toBeInTheDocument();
  });
});
