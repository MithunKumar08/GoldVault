import React from "react";
import { XCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../invest/PaymentResult.css";

const PaymentFailure = () => {
  const navigate = useNavigate();
  const transactionId = localStorage.getItem('sessionId');

  return (
    <div className="payment-result-page">
      <div className="payment-result-card">

        <div className="payment-result-icon failure">
          <XCircle size={64} />
        </div>

        <h1>Payment Failed</h1>

        <p>
          We couldn't complete your payment.
        </p>

        <h3>
          Transaction ID: {transactionId}
        </h3>

        <p className="payment-result-subtext">
          No worries. Please try again.
        </p>

        <button
          className="gv-btn gv-btn-gold"
          onClick={() => navigate("/invest")}
        >
          <ArrowLeft size={18} />
          Try Again
        </button>

      </div>
    </div>
  );
};

export default PaymentFailure;