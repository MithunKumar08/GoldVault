import { useState, useMemo } from "react";
import { TrendingUp, ShieldCheck, Zap, ArrowLeft, ArrowRight } from "lucide-react";
import "../invest/InvestmentTab.css";
import '../theme.css'
import HeaderTab from '../Navbar/Header'
import ApiService from "../APIService/ApiService";

// ---------------------------------------------------------------------------
// Plan config
// ---------------------------------------------------------------------------


const QUICK_AMOUNTS = [500, 1000, 5000, 10000];
const MIN_AMOUNT = 500;
const MAX_AMOUNT = 250000;

function formatCurrency(n) {
  return n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function InvestmentFlow({ onComplete }) {
  const [step, setStep] = useState("invest"); // invest | payment
  const [amount, setAmount] = useState(1000);
  const [amountInput, setAmountInput] = useState("1000");
  const [error, setError] = useState("");

  function handleAmountChange(raw) {
    const cleaned = raw.replace(/[^\d.]/g, "");
    setAmountInput(cleaned);
    const n = parseFloat(cleaned);
    setAmount(Number.isFinite(n) ? n : 0);
  }

  function selectQuickAmount(n) {
    setAmount(n);
    setAmountInput(String(n));
  }

  async function handleContinue() {
    if (!amount || amount < MIN_AMOUNT) {
      setError(`Minimum investment is ${formatCurrency(MIN_AMOUNT)}.`);
      return;
    }
    if (amount > MAX_AMOUNT) {
      setError(`Maximum investment is ${formatCurrency(MAX_AMOUNT)}.`);
      return;
    }
    setError("");
    try{
      const paymentRequest = {
        productName: "gold_invest",
        quantity: 1,
        amount: amount*100,
        currency: "inr"
      }

    const response = await ApiService.makePayment(paymentRequest);
    console.log("Captured Data: ",response.url)
    if(response.status === 'SUCCESS' && response.url){
      window.location.href = response.url;
    }
    }catch (error){
      console.log(error);
    }
    //setStep("payment");
  }

  async function handlePaymentSubmit(card) {
    // Forward both the investment choice and the tokenized card details
    // to your backend / provider here.
    if (onComplete) {
      await onComplete({ amount, card });
    } else {
      await new Promise((res) => setTimeout(res, 1000));
    }
  }


  return (
    <div className="investment-card">
      <h2 className="investment-title">Start an investment</h2>
      <p className="investment-subtitle">
        Turn your savings into opportunities through disciplined investing.
      </p>

      {/* Amount input */}
      <div className="amount-section">
        <label className="field-label">Investment amount</label>
        <div className="amount-input-wrap">
          <span className="amount-prefix">₹</span>
          <input
            type="text"
            inputMode="decimal"
            value={amountInput}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="1000"
            className="amount-input"
          />
        </div>
        {error && <p className="field-error">{error}</p>}

        <div className="quick-amounts">
          {QUICK_AMOUNTS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => selectQuickAmount(n)}
              className={`quick-amount${amount === n ? " quick-amount--active" : ""}`}
            >
              {formatCurrency(n)}
            </button>
          ))}
        </div>
      </div>

      <button type="button" className="btn-primary" onClick={handleContinue}>
        Continue to payment
        <ArrowRight className="icon-sm" />
      </button>
    </div>
  );
}
