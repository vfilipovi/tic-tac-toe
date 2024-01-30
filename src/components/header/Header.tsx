import { FC } from "react";
import UserControls from "./UserControls";
import { NavLink } from "react-router-dom";

const Header: FC = () => {
  return (
    <header className="bg-theme-blue-500 text-white p-4 mx-auto md:w-[50%] mt-6 rounded-3xl">
      <nav className="container mx-auto flex items-center justify-between">
        <div className="text-lg font-bold"> Tic Tac Toe</div>
        <ul className="flex space-x-4">
          <li className="flex items-center">
            <NavLink to="/">
              <div className="hover:text-gray-300 text-white">Home Page</div>
            </NavLink>
          </li>
          <li className="flex items-center">
            <UserControls />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
