import LoginPage from "../components/LoginPage";

export default function StaffLogin({ role = "salesman" }) {
  return <LoginPage initialRole={role} />;
}

