import React from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../invest/PaymentResult.css";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const transactionId = localStorage.getItem('sessionId');

  return (
    <div className="payment-result-page">
      <div className="payment-result-card">

        <div className="payment-result-icon success">
          <CheckCircle size={64} />
        </div>

        <h1>Payment Successful!</h1>

        <p>
          Your investment has been successfully completed.
        </p>

        <h3>
          Transaction ID: {transactionId}
        </h3>

        <p className="payment-result-subtext">
          Thank you for investing with GoldVault.
        </p>

        <button
          className="gv-btn gv-btn-gold"
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
          <ArrowRight size={18} />
        </button>

      </div>
    </div>
  );
};

export default PaymentSuccess;