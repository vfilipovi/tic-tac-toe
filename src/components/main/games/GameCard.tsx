import { Button, Card, CardBody, Image } from "@nextui-org/react";
import { FC, useState } from "react";
import gameImage from "../../../assets/game-icon.png";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Game } from "../../../pages/GamesList";
import { joinGame } from "../../utilFunctions/gameRequestsHelper";
import ModalWrapper from "../../utilComponents/ModalWrapper";

const GameCard: FC<Game> = ({
  created,
  first_player,
  second_player,
  status,
  winner,
  id,
}) => {
  const navigate = useNavigate();
  const [joinGameBtnLoader, setJoinGameBtnLoader] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const userId = +localStorage.getItem("id")!;

  const handleJoinGame = () => {
    if (
      status === "open" &&
      first_player?.id !== userId &&
      second_player?.id !== userId
    ) {
      setJoinGameBtnLoader(true);
      joinGame(id)
        .then(() => {
          setJoinGameBtnLoader(false);
          navigate("/board", {
            state: { id: id },
          });
        })
        .catch((err) => {
          setJoinGameBtnLoader(false);
          setModalMessage(err.errors[0].message);
        });
    } else {
      navigate("/board", { state: { id: id } });
    }
  };

  const getBtnText = () => {
    if (status === "open") {
      if (first_player?.id === userId || second_player?.id === userId) {
        return "Resume game";
      } else {
        return "Join game";
      }
    }
    if (status === "progress") {
      if (first_player?.id === userId || second_player?.id === userId) {
        return "Resume Game";
      } else {
        return "View Game";
      }
    }
    if (status === "finished") {
      if (first_player?.id === userId || second_player?.id === userId) {
        return "Review your game";
      } else {
        return "View Game";
      }
    }
  };

  return (
    <>
      <ModalWrapper
        content={modalMessage}
        openModal={!!modalMessage}
        onModalClose={() => setModalMessage("")}
      />
      <Card
        isBlurred
        className={`border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]`}
        shadow="sm"
      >
        <CardBody>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
            <div className="relative col-span-6 md:col-span-4">
              <Image
                alt="Game Image"
                className="object-cover"
                height={200}
                shadow="md"
                src={gameImage}
                width="100%"
              />
            </div>

            <div className="flex flex-col col-span-6 md:col-span-8">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-0">
                  <h3 className="font-semibold text-foreground/90">
                    {`Status: ` + status}
                  </h3>
                  <p className="text-small text-foreground/80">
                    {"Created: " +
                      format(new Date(created), "dd/MM/yyyy 'at' HH:mm")}
                  </p>
                  <h1 className="text-large font-medium mt-2">
                    Game: Tic Tac Toe - {id}
                  </h1>
                  <h4 className="text-medium font-medium mt-2">
                    {winner?.username ? "Winner: " + winner.username : null}
                  </h4>
                </div>
              </div>

              <div className="flex flex-col mt-10 gap-4"></div>
              <div className="flex w-full items-center justify-center">
                <Button
                  className="data-[hover]:bg-foreground/10"
                  variant="light"
                  onClick={handleJoinGame}
                  isLoading={joinGameBtnLoader}
                >
                  {getBtnText()}
                </Button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default GameCard;
