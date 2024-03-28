import "@testing-library/jest-dom";
import { fireEvent, render, waitFor } from "@testing-library/react";
import UserSignIn from "../../../../components/main/signIn/UserSignIn";
import { BrowserRouter, useLocation } from "react-router-dom";
import { login, registerUser } from "../../../../auth/AuthService";

jest.mock("../../../../auth/AuthService");

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));

describe("UserSignIn Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders SignIn form correctly", () => {
    jest.mocked(useLocation).mockReturnValueOnce({
      state: { type: "signin" },
      key: "",
      pathname: "",
      search: "",
      hash: "",
    });
    // LocationState - type: "signin"
    const { getByLabelText, getByText } = render(
      <BrowserRouter>
        <UserSignIn />
      </BrowserRouter>
    );

    expect(getByLabelText("Username")).toBeInTheDocument();
    expect(getByLabelText("Password")).toBeInTheDocument();
    expect(getByText("Sign in")).toBeInTheDocument();
  });

  // LocationState - type: "sign in"
  test("submits login form correctly", async () => {
    jest.mocked(useLocation).mockReturnValue({
      state: { type: "signin" },
      key: "",
      pathname: "",
      search: "",
      hash: "",
    });
    const { getByLabelText, getByText } = render(
      <BrowserRouter>
        <UserSignIn />
      </BrowserRouter>
    );

    fireEvent.change(getByLabelText("Username"), {
      target: { value: "testUser" },
    });
    fireEvent.change(getByLabelText("Password"), {
      target: { value: "testPassword" },
    });
    fireEvent.submit(getByText("Sign in"));

    await waitFor(() => {
      expect(login).toHaveBeenCalledTimes(1);
      expect(login).toHaveBeenCalledWith("testUser", "testPassword");
    });
  });

  // LocationState - type: "registration"
  test("submits registration form correctly", async () => {
    jest.mocked(useLocation).mockReturnValue({
      state: { type: "registration" },
      key: "",
      pathname: "",
      search: "",
      hash: "",
    });
    const { getByLabelText, getByText } = render(
      <BrowserRouter>
        <UserSignIn />
      </BrowserRouter>
    );

    fireEvent.change(getByLabelText("Username"), {
      target: { value: "testUser" },
    });
    fireEvent.change(getByLabelText("Password"), {
      target: { value: "testPassword" },
    });

    fireEvent.submit(getByText("Registration"));

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledTimes(1);
      expect(registerUser).toHaveBeenCalledWith("testUser", "testPassword");
    });
  });
});
