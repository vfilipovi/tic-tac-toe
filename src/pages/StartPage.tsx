import { Button } from "@nextui-org/react";
import { isLoggedIn } from "../auth/AuthService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createNewGame } from "../components/utilFunctions/gameRequestsHelper";
import ModalWrapper from "../components/utilComponents/ModalWrapper";

const StartPage = () => {
  const navigate = useNavigate();
  const [createNewGameBtnLoader, setCreateNewGameBtnLoader] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  if (isLoggedIn()) {
    return (
      <div className="flex justify-evenly mt-14">
        <ModalWrapper
          content={modalMessage}
          openModal={!!modalMessage}
          onModalClose={() => setModalMessage("")}
        />
        <Button
          size="lg"
          onClick={() => {
            navigate("/games");
          }}
        >
          Browse all games
        </Button>
        <Button
          isLoading={createNewGameBtnLoader}
          size="lg"
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
      </div>
    );
  } else
    return (
      <div>
        <h1 className="text-3xl mt-32">Please register or sign-in !</h1>
      </div>
    );
};

export default StartPage;
