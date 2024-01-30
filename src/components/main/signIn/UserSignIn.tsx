import { Button, Input, Spinner } from "@nextui-org/react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login, registerUser } from "../../../auth/AuthService";
import ModalWrapper from "../../utilComponents/ModalWrapper";

interface FormData {
  username: string;
  password: string;
}

interface LocationStateProps {
  type: "registration" | "signin";
}

interface RegisterResponseInt {
  errors?: {
    path: string;
    code: string;
    message: string;
  }[];
}

const UserSignIn = () => {
  const navigate = useNavigate();
  const locationState = useLocation().state as LocationStateProps;
  const [modalMessage, setModalMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (locationState?.type === "registration") {
      handleRegistration();
    } else handleLogin();
  };

  const handleLogin = async () => {
    setIsLoading(true);
    const loginResponse: RegisterResponseInt = (await login(
      formData.username,
      formData.password
    )) as RegisterResponseInt;

    if (
      loginResponse &&
      loginResponse.errors &&
      loginResponse.errors.length > 0
    ) {
      setIsLoading(false);
      setModalMessage(loginResponse.errors[0].message);
    } else {
      setIsLoading(false);
      navigate("/games");
    }
  };

  const handleRegistration = async () => {
    setIsLoading(true);
    const registerResponse: RegisterResponseInt = (await registerUser(
      formData.username,
      formData.password
    )) as RegisterResponseInt;
    if (
      registerResponse &&
      registerResponse.errors &&
      registerResponse.errors.length > 0
    ) {
      setIsLoading(false);
      setModalMessage(registerResponse.errors[0].message);
    } else {
      setIsLoading(false);
      setModalMessage("Successful registration. Please log-in!");
      navigate("/sign-in", { state: { type: "signin" } });
    }
  };

  if (isLoading) {
    return <Spinner size={"lg"} />;
  } else
    return (
      <>
        <ModalWrapper
          content={modalMessage}
          openModal={!!modalMessage}
          onModalClose={() => setModalMessage("")}
        />
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
          <div className="mb-10">
            <Input
              label="Username"
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              isRequired
            />
          </div>
          <div className="mb-10">
            <Input
              label="Password"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              isRequired
            />
          </div>
          <Button type="submit">
            {locationState?.type === "registration"
              ? "Registracija"
              : "Prijava"}
          </Button>
        </form>
      </>
    );
};

export default UserSignIn;
