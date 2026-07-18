import { useMemo } from "react";
import {
  Gem,
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Bell,
} from "lucide-react";
import "../theme.css";
import "../dashboard/GoldDashboard.css";
import HeaderTab from '../Navbar/Header'

const PLANS = [
  { id: "monthly", name: "Monthly Saver", icon: ShieldCheck, blurb: "Fixed amount every month" },
  { id: "flexi", name: "Flexi Save", icon: TrendingUp, blurb: "Save any amount, any time" },
  { id: "lumpsum", name: "Lumpsum", icon: Zap, blurb: "One deposit, locked-in rate" },
];

const TRANSACTIONS = [
  { id: 1, label: "Monthly Saver deposit", date: "12 Jul", grams: 1.42, amount: 8600, type: "credit" },
  { id: 2, label: "Gold rate bonus", date: "8 Jul", grams: 0.06, amount: 360, type: "credit" },
  { id: 3, label: "Redeemed — Tulip Studs", date: "29 Jun", grams: -3.1, amount: -18750, type: "debit" },
  { id: 4, label: "Monthly Saver deposit", date: "12 Jun", grams: 1.38, amount: 8350, type: "credit" },
];

const CATALOGUE = [
  { id: 1, name: "Tulip Drop Earrings", grams: 4.2, tone: "rose" },
  { id: 2, name: "Filigree Bangle", grams: 11.8, tone: "gold" },
  { id: 3, name: "Layered Chain", grams: 7.5, tone: "deep" },
];

export default function Dashboard({ customerName = "Mithun" }) {
  const goalGrams = 25;
  const savedGrams = 16.4;
  const progressPct = Math.min(100, Math.round((savedGrams / goalGrams) * 100));

  const savedValue = useMemo(() => savedGrams * 6050, [savedGrams]);

  return (
    <div className="gv-scope gv-dash">

      <main className="gv-dash-main">
        {/* Hero balance card */}
        <section className="gv-hero">
          <div className="gv-hero-copy">
            <p className="gv-eyebrow">Welcome back, {customerName}</p>
            <h1>Your Investment</h1>
            <div className="gv-hero-figure">
              <span className="gv-hero-value"> ₹{savedValue.toLocaleString("en-IN")}</span>
            </div>
            <div className="gv-hero-actions">
              <button className="gv-btn gv-btn-gold">
                <Plus size={16} /> Add funds
              </button>
            
            </div>
          </div>

          <GoldGauge percent={progressPct} savedGrams={savedGrams} goalGrams={goalGrams} />
        </section>

        {/* Plans */}
        {/* <section className="gv-section">
          <div className="gv-section-head">
            <h2>Savings plans</h2>
            <a href="#" className="gv-link">View all</a>
          </div>
          <div className="gv-plan-grid">
            {PLANS.map((p) => {
              const Icon = p.icon;
              return (
                <button key={p.id} className="gv-plan-card">
                  <Icon size={18} className="gv-plan-icon" />
                  <div className="gv-plan-name">{p.name}</div>
                  <div className="gv-plan-blurb">{p.blurb}</div>
                </button>
              );
            })}
          </div>
        </section> */}

        <div className="gv-dash-columns">
          {/* Transactions ledger */}
          <section className="gv-section gv-ledger-section">
            <div className="gv-section-head">
              <h2>Recent activity</h2>
              <a href="#" className="gv-link">See all</a>
            </div>
            <div className="gv-ledger-card">
              {TRANSACTIONS.map((t) => (
                <div className="gv-ledger-row" key={t.id}>
                  <div className="gv-ledger-left">
                    <span className={`gv-ledger-dot ${t.type}`}>
                      {t.type === "credit" ? (
                        <ArrowUpRight size={13} />
                      ) : (
                        <ArrowDownRight size={13} />
                      )}
                    </span>
                    <div>
                      <div className="gv-ledger-label">{t.label}</div>
                      <div className="gv-ledger-date">{t.date}</div>
                    </div>
                  </div>
                  <div className="gv-ledger-right">
                    <div className={`gv-ledger-amount ${t.type === "credit" ? "positive" : "negative"}`}>
                      {t.grams > 0 ? "+" : ""}
                      {t.grams.toFixed(2)}g
                    </div>
                    <div className="gv-ledger-sub">
                      {t.amount > 0 ? "+" : "-"}₹{Math.abs(t.amount).toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Redeemable catalogue */}
          {/* <section className="gv-section gv-catalogue-section">
            <div className="gv-section-head">
              <h2>Ready to redeem</h2>
              <a href="#" className="gv-link">Browse catalogue</a>
            </div>
            <div className="gv-catalogue-list">
              {CATALOGUE.map((item) => (
                <div className="gv-catalogue-card" key={item.id}>
                  <div className={`gv-catalogue-swatch tone-${item.tone}`}>
                    <Gem size={20} />
                  </div>
                  <div className="gv-catalogue-info">
                    <div className="gv-catalogue-name">{item.name}</div>
                    <div className="gv-catalogue-grams">{item.grams}g equivalent</div>
                  </div>
                  <div
                    className={`gv-catalogue-status ${
                      item.grams <= savedGrams ? "ready" : "locked"
                    }`}
                  >
                    {item.grams <= savedGrams ? "Ready" : `Need ${(item.grams - savedGrams).toFixed(1)}g`}
                  </div>
                </div>
              ))}
            </div>
          </section> */}
        </div>
      </main>
    </div>
  );
}

/* Signature element: a circular gold gauge that reads like a jeweller's
   weighing dial, showing progress toward the next redeemable piece. */
function GoldGauge({ percent, savedGrams, goalGrams }) {
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="gv-gauge">
      <svg viewBox="0 0 160 160" className="gv-gauge-svg">
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="var(--ink-line)"
          strokeWidth="8"
        />
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="var(--gold-bright)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 80 80)"
          className="gv-gauge-ring"
        />
      </svg>
      <div className="gv-gauge-center">
        <span className="gv-gauge-pct">{percent}%</span>
        <span className="gv-gauge-label">to next piece</span>
      </div>
      <p className="gv-gauge-note">
        {savedGrams.toFixed(1)}g of {goalGrams}g goal
      </p>
    </div>
  );
}
