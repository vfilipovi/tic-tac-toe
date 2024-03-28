import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { isLoggedIn } from "../../../auth/AuthService";
import UserControls from "../../../components/header/UserControls";

jest.mock("../../../auth/AuthService");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("UserControls Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders UserControls correctly when logged in", () => {
    (isLoggedIn as jest.Mock).mockReturnValue(true);
    localStorage.setItem("username", "TestUser");
    localStorage.setItem("token", "#123456789");
    const { getByText } = render(<UserControls />);
    fireEvent.click(getByText(localStorage.getItem("username")!));
    expect(getByText("TestUser")).toBeInTheDocument();
    expect(getByText("Logout")).toBeInTheDocument();
  });

  test("renders UserControls correctly when not logged in", () => {
    (isLoggedIn as jest.Mock).mockReturnValue(false);
    const { getByText } = render(<UserControls />);
    const inputNode = screen.getByRole("img");
    fireEvent.click(inputNode);
    expect(getByText("Registration")).toBeInTheDocument();
    expect(getByText("Sign-in")).toBeInTheDocument();
    const logoutBtn = screen.queryByText("Logout");
    expect(logoutBtn).not.toBeInTheDocument();
  });
});
