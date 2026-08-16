import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate
} from "react-router-dom";

import GoldDashboard from "./dashboard/GoldDashboard";
import InvestmentTab from "./invest/InvestmentTab";
import LoginPage from "./login/LoginPage";
import HeaderTab from "./Navbar/Header";
import Transaction from "./transaction/Transaction";
import ApiService from "./APIService/ApiService";
import PaymentSuccess from "./invest/PaymentSuccess";
import PaymentFailed from "./invest/PaymentFailure";

import "./App.css";


const ProtectedRoute = () => {

  const isAuthenticated = ApiService.isAuthenticated();

  console.log("ProtectedRoute:", isAuthenticated);

  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" replace />;
};


function MainLayout() {

  return (
    <>
      <HeaderTab />
      <Outlet />
    </>
  );
}


function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* Public */}
        <Route
          path="/login"
          element={<LoginPage />}
        />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>

          <Route element={<MainLayout />}>

            <Route
              path="/dashboard"
              element={<GoldDashboard />}
            />

            <Route
              path="/invest"
              element={<InvestmentTab />}
            />

            <Route
              path="/transaction"
              element={<Transaction />}
            />

            <Route 
            path="/success"
            element={<PaymentSuccess />}
            />

            <Route 
            path="/failed"
            element={<PaymentFailed />}
            />

          </Route>

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;