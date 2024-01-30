import { Fragment, useEffect, useState } from "react";
import { API_URL } from "../auth/AuthService";
import { authenticatedGet } from "../auth/AuthenticatedRequest";
import GameCard from "../components/main/games/GameCard";
import { Button, Pagination, Spacer, Spinner } from "@nextui-org/react";
import ModalWrapper from "../components/utilComponents/ModalWrapper";
import { useNavigate } from "react-router-dom";
import SelectGameStatus from "../components/main/games/SelectGameStatus";
import { createNewGame } from "../components/utilFunctions/gameRequestsHelper";

export interface GamesResponse {
  count: number;
  next: string;
  previous: string;
  results: {
    id: number;
    created: string;
    status: "finished" | "progress" | "open";
    winner: { id: number; username: string };
    first_player: { id: number; username: string };
    second_player: { id: number; username: string };
    board: (null | number)[][];
  }[];
}

export interface Game {
  id: number;
  created: string;
  status: "finished" | "progress" | "open";
  winner: { id: number; username: string };
  first_player: { id: number; username: string };
  second_player: { id: number; username: string };
  board: (null | number)[][];
}

const GamesList = () => {
  const [games, setGames] = useState<GamesResponse>();
  const [currentPage, setCurrentPage] = useState(1);
  const [modalMessage, setModalMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [gameStatus, setGameStatus] = useState<string>("");
  const [createNewGameBtnLoader, setCreateNewGameBtnLoader] = useState(false);
  const navigate = useNavigate();

  // Fetch games based on selected page and status
  useEffect(() => {
    setIsLoading(true);
    authenticatedGet(
      `${API_URL}/games/?limit=10&offset=${
        10 * (currentPage - 1)
      }&status=${gameStatus}`
    )
      .then((response) => {
        setGames(response);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setModalMessage(err.errors[0].message);
      });
  }, [gameStatus, currentPage]);

  return (
    <>
      <ModalWrapper
        content={modalMessage}
        openModal={!!modalMessage}
        onModalClose={() => setModalMessage("")}
      />
      {isLoading && <Spinner size="lg" />}
      {games?.results && !isLoading && (
        <div>
          <div className="flex justify-evenly w-full mb-8 items-center">
            <Button
              size={"lg"}
              isLoading={createNewGameBtnLoader}
              onClick={() => {
                setCreateNewGameBtnLoader(true);
                createNewGame()
                  .then((response) => {
                    if ("id" in response) {
                      setCreateNewGameBtnLoader(false);
                      navigate("/board", {
                        state: { id: response.id },
                      });
                    } else {
                      setCreateNewGameBtnLoader(false);
                    }
                  })
                  .catch((err) => {
                    setCreateNewGameBtnLoader(false);
                    setModalMessage(err.errors[0].message);
                  });
              }}
            >
              New game
            </Button>
            <div className="w-60">
              <SelectGameStatus
                setGameStatusValue={setGameStatus}
                value={gameStatus}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>

          <div className="flex flex-col items-center">
            {games.results?.map((game, index) => {
              return (
                <Fragment key={"fragment-" + index}>
                  <GameCard
                    key={"game-" + index}
                    created={game.created}
                    first_player={game.first_player}
                    second_player={game.second_player}
                    id={game.id}
                    status={game.status}
                    winner={game.winner}
                    board={game.board}
                  />
                  <Spacer y={12} />
                </Fragment>
              );
            })}

            {games && (
              <Pagination
                total={Math.ceil(games.count / 10)}
                initialPage={1}
                page={currentPage}
                onChange={setCurrentPage}
                size={"lg"}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default GamesList;
