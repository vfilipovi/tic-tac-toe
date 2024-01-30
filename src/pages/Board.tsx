import { FC, useEffect, useState } from "react";
import {
  authenticatedGet,
  authenticatedPost,
} from "../auth/AuthenticatedRequest";
import { API_URL } from "../auth/AuthService";
import ModalWrapper from "../components/utilComponents/ModalWrapper";
import { useLocation } from "react-router-dom";
import { Game } from "./GamesList";
import { useInterval } from "../hooks/useInterval";

interface LocationStateProps {
  id: number;
}

const Board: FC = () => {
  const [gameData, setGameData] = useState<Game>();
  const [uniqueNumbersInBoard, setUniqueNumbersInBoard] = useState<number[]>();
  const [modalMessage, setModalMessage] = useState("");
  const locationState = useLocation().state as LocationStateProps;
  const [isIntervalRunning, setIsIntervalRunning] = useState(true);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = () => {
    authenticatedGet(`${API_URL}/games/${locationState?.id}/`)
      .then((response) => {
        setGameData(response);
        if (response?.first_player?.id && response?.second_player?.id) {
          setUniqueNumbersInBoard([
            response?.first_player?.id,
            response?.second_player?.id,
          ]);
        }
        // Clear interval if game status if "finished"
        if (response.status === "finished") {
          setIsIntervalRunning(false);
        }
      })
      .catch((err) => {
        setModalMessage(err.errors[0].message);
      });
  };

  // Set the mark on the board and wait for confirmation from the backend. Otherwise, revert the choice
  const handleCellSelect = (rowIndex: number, cellIndex: number) => {
    const updatedGameData = { ...gameData } as Game;

    if (updatedGameData.board) {
      updatedGameData.board[rowIndex][cellIndex] = +localStorage.getItem("id")!;
      setGameData(updatedGameData);
      authenticatedPost(`${API_URL}/games/${locationState?.id}/move/`, {
        row: rowIndex,
        col: cellIndex,
      })
        .then(() => {})
        .catch((err) => {
          updatedGameData.board[rowIndex][cellIndex] = null;
          setModalMessage(err.errors[0].message);
        });
    }
  };

  // Set interval for fetching game data every 5s
  // Only for "open" and in "progress" statuses
  useInterval(fetchData, isIntervalRunning ? 5000 : null);

  return (
    <>
      <ModalWrapper
        content={modalMessage}
        openModal={!!modalMessage}
        onModalClose={() => setModalMessage("")}
      />
      {gameData && (
        <div>
          {gameData.status === "finished" && (
            <h3 className="text-3xl font-bold mb-8">
              Winner: {gameData?.winner?.username || " ---"}
            </h3>
          )}
          <h3 className="text-2xl font-bold mb-4">
            Player 1: {gameData?.first_player?.username}
            {uniqueNumbersInBoard?.length === 2
              ? uniqueNumbersInBoard![0] === gameData?.first_player?.id
                ? " (X)"
                : " (O)"
              : null}
          </h3>

          <h3 className="text-2xl font-bold">
            Player 2: {gameData?.second_player?.username}
            {uniqueNumbersInBoard?.length === 2
              ? uniqueNumbersInBoard![0] === gameData?.second_player?.id
                ? " (X)"
                : " (O)"
              : null}
          </h3>

          {gameData?.board && (
            <div className="gap-4 mt-16">
              {gameData.board.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center">
                  {row.map((cell, cellIndex) => (
                    <div
                      key={cellIndex}
                      className="w-28 h-28 border border-gray-500 flex justify-center items-center *:text-3xl *:cursor-default"
                    >
                      {uniqueNumbersInBoard?.length == 2 ? (
                        cell === uniqueNumbersInBoard[0] ? (
                          <span className="text-rose-600">X</span>
                        ) : cell === uniqueNumbersInBoard[1] ? (
                          <span className="text-green-700">O</span>
                        ) : (
                          <div
                            className="!cursor-pointer w-full h-full"
                            onClick={() => {
                              handleCellSelect(rowIndex, cellIndex);
                            }}
                          ></div>
                        )
                      ) : null}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Board;
