import { useState, useEffect } from "react";
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


export default function Dashboard({ customerName = "" }) {

  const pageNo = 0;
  const tranSize = 5;

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashData, setDashData] = useState({
    userName: "",
    firstChar: "",
    wallet_amount: ""
  })

  useEffect(() => {

    const getAllTransactions = async () => {

      try {

        setLoading(true);

        const response = await ApiService.getAllTransactions(pageNo,tranSize);

        console.log("Transactions:", response.content);

        setTransactions(response.content || []);

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

    const getDashData = async () => {
      const dashResponse = await ApiService.getDashData();

      setDashData({
        userName : dashResponse.userName,
        firstChar : dashResponse.userName[0],
        wallet_amount : dashResponse.wallet_amount

      })
      
    } 

    getAllTransactions();
    getDashData();

  }, []);

  const handleAddFund= () => {
    window.location.href = "/invest";
  }

  customerName = dashData.userName;

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
                ₹{dashData.wallet_amount}
              </span>
            </div>

            <div className="gv-hero-actions">

              <button className="gv-btn gv-btn-gold" onClick={handleAddFund}>
                <Plus size={16} />
                Add funds
              </button>

            </div>

          </div>

          <GoldGauge />

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
/* Gold Gauge (decorative)                                       */
/* ------------------------------------------------------------ */

function GoldGauge() {

  return (

    <div className="gv-gauge">

      <div className="gv-gauge-ring-wrap">

        <svg
          viewBox="0 0 160 160"
          className="gv-gauge-svg"
        >

          {/* Outer coin body */}
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="var(--gold-bright)"
            opacity="0.15"
          />

          <circle
            cx="80"
            cy="80"
            r="62"
            fill="none"
            stroke="var(--gold-bright)"
            strokeWidth="3"
          />

          <circle
            cx="80"
            cy="80"
            r="50"
            fill="none"
            stroke="var(--gold-bright)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.6"
          />

          {/* Center emblem - stylized bar/ingot */}
          <g transform="translate(80,80)">

            <rect
              x="-26"
              y="-12"
              width="52"
              height="24"
              rx="3"
              fill="var(--gold-bright)"
            />

            <rect
              x="-20"
              y="-7"
              width="40"
              height="14"
              rx="2"
              fill="none"
              stroke="var(--ink-bg, #1a1a1a)"
              strokeWidth="1"
              opacity="0.35"
            />

            <text
              x="0"
              y="5"
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill="var(--ink-bg, #1a1a1a)"
              opacity="0.7"
            >
              999.9
            </text>

          </g>

        </svg>

      </div>

      <p className="gv-gauge-note">
        Your gold, safely vaulted
      </p>

    </div>
  );
}