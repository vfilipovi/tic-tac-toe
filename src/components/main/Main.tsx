import { Route, Routes } from "react-router-dom";
import StartPage from "../../pages/StartPage";
import UserSignIn from "./signIn/UserSignIn";
import GamesList from "../../pages/GamesList";
import Board from "../../pages/Board";

const Main = () => {
  return (
    <main className="flex-1 w-screen mx-auto mt-4 p-4" style={{ width: "70%" }}>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/registration" element={<UserSignIn />} />
        <Route path="/sign-in" element={<UserSignIn />} />
        <Route path="/games" element={<GamesList />} />
        <Route path="/board" element={<Board />} />
      </Routes>
    </main>
  );
};

export default Main;
