import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@nextui-org/react";
import userImage from "../../assets/user-icon.png";
import { MouseEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn, logout } from "../../auth/AuthService";
import ModalWrapper from "../utilComponents/ModalWrapper";

const items = [
  {
    key: "registration",
    label: "Registration",
  },
  {
    key: "signin",
    label: "Sign-in",
  },
  {
    key: "logout",
    label: "Logout",
  },
];

const UserControls = () => {
  const navigate = useNavigate();
  const [modalMessage, setModalMessage] = useState("");

  const handleOnClick = (e: MouseEvent<HTMLLIElement>) => {
    switch (e.currentTarget.outerText) {
      case "Registration":
        navigate("/registration", { state: { type: "registration" } });
        break;
      case "Sign-in":
        navigate("/sign-in", { state: { type: "signin" } });
        break;
      case "Logout":
        logout()
          .then(() => {
            navigate("/sign-in");
          })
          .catch((err) => {
            setModalMessage(err.errors[0].message);
          });
        break;
    }
  };

  let filteredItems;
  let username = "User";

  // Display 'Sign-In' and 'Registration' if the user is not logged in; otherwise, show 'Logout'
  if (isLoggedIn()) {
    filteredItems = items.filter(
      (item) => item.key !== "registration" && item.key !== "signin"
    );
    username = localStorage.getItem("username")!;
  } else {
    filteredItems = items.filter((item) => item.key !== "logout");
  }

  return (
    <>
      <ModalWrapper
        content={modalMessage}
        openModal={!!modalMessage}
        onModalClose={() => setModalMessage("")}
      />
      <Dropdown>
        <DropdownTrigger>
          <User
            name={username}
            style={{ cursor: "pointer" }}
            avatarProps={{ src: userImage }}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Dynamic Actions" items={filteredItems}>
          {(item) => {
            return (
              <DropdownItem
                key={item.key}
                color={item.key === "logout" ? "danger" : "default"}
                className={item.key === "logout" ? "text-danger" : ""}
                onClick={handleOnClick}
              >
                {item.label}
              </DropdownItem>
            );
          }}
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

export default UserControls;
