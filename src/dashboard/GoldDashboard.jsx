import { useMemo, useState, useEffect } from "react";
import { Plus, Coins } from "lucide-react";

import "../theme.css";
import "../dashboard/GoldDashboard.css";
import ApiService from "../APIService/ApiService";

function formatDate(iso) {
  if (!iso) return "";

  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}


export default function Dashboard({ customerName = "Mithun" }) {

  const goalGrams = 25;
  const savedGrams = 16.4;

  const progressPct = Math.min(
    100,
    Math.round((savedGrams / goalGrams) * 100)
  );

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const savedValue = useMemo(
    () => savedGrams * 6050,
    [savedGrams]
  );

  useEffect(() => {

    const getAllTransactions = async () => {

      try {

        setLoading(true);

        const response = await ApiService.getAllTransactions();

        console.log("Transactions:", response);

        setTransactions(response || []);

      } catch (error) {

        console.error(
          "Error Fetching Transactions:",
          error
        );

        setTransactions([]);

      } finally {

        setLoading(false);

      }
    };

    getAllTransactions();

  }, []);

  return (
    <div className="gv-scope gv-dash">

      <main className="gv-dash-main">

        {/* Hero */}
        <section className="gv-hero">

          <div className="gv-hero-copy">

            <p className="gv-eyebrow">
              Welcome back, {customerName}
            </p>

            <h1>Your Investment</h1>

            <div className="gv-hero-figure">
              <span className="gv-hero-value">
                ₹{savedValue.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="gv-hero-actions">

              <button className="gv-btn gv-btn-gold">
                <Plus size={16} />
                Add funds
              </button>

            </div>

          </div>

          <GoldGauge
            percent={progressPct}
            savedGrams={savedGrams}
            goalGrams={goalGrams}
          />

        </section>


        {/* Dashboard columns */}
        <div className="gv-dash-columns">

          {/* Transactions */}
          <section className="gv-section gv-ledger-section">

            <div className="gv-section-head">

              <h2>Recent activity</h2>

              <a href="/transaction" className="gv-link">
                See all
              </a>

            </div>


            <div className="gv-ledger-card">

              {loading ? (

                <div className="gv-empty-state">
                  Loading transactions...
                </div>

              ) : transactions.length === 0 ? (

                <div className="gv-empty-state">
                  No transactions found.
                </div>

              ) : (

                transactions.slice(0, 5).map((t) => {

                  const statusKey = String(t.status || "").toLowerCase();

                  const statusClass = statusKey.includes("success") ||
                    statusKey.includes("complete")
                    ? "success"
                    : statusKey.includes("fail")
                    ? "failed"
                    : "pending";

                  return (

                    <div
                      className="gv-ledger-row"
                      key={t.id || t.sessionId}
                    >

                      <div className="gv-ledger-left">

                        <div className="gv-ledger-dot">
                          <Coins size={16} />
                        </div>

                        <div>

                          <div className="gv-ledger-label">
                            {t.sessionId}
                          </div>

                          <div className="gv-ledger-date">
                           {formatDate(t.transactionTime)}
                          </div>

                        </div>

                      </div>

                      {/* <div className="gv-ledger-right"> */}

                        <span className="gv-ledger-amount">
                          ₹{Number(t.amount).toLocaleString("en-IN")}
                        </span>

                        <span className={`gv-ledger-status ${statusClass}`}>
                          {t.status}
                        </span>

                      {/* </div> */}

                    </div>

                  );

                })

              )}

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}


/* ------------------------------------------------------------ */
/* Gold Gauge                                                    */
/* ------------------------------------------------------------ */

function GoldGauge({
  percent,
  savedGrams,
  goalGrams
}) {

  const radius = 68;

  const circumference =
    2 * Math.PI * radius;

  const offset =
    circumference -
    (percent / 100) * circumference;

  return (

    <div className="gv-gauge">

      <div className="gv-gauge-ring-wrap">

        <svg
          viewBox="0 0 160 160"
          className="gv-gauge-svg"
        >

          {/* Background */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="var(--ink-line)"
            strokeWidth="8"
          />

          {/* Progress */}
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

          <span className="gv-gauge-pct">
            {percent}%
          </span>

          <span className="gv-gauge-label">
            to next piece
          </span>

        </div>

      </div>


      <p className="gv-gauge-note">
        {savedGrams.toFixed(1)}g of {goalGrams}g goal
      </p>

    </div>
  );
}
