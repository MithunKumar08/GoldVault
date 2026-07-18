import { useMemo, useState } from "react";
import { ArrowUpRight, ArrowDownRight, Search, Download } from "lucide-react";
import "../theme.css";
import "../transaction/Transaction.css";

const TRANSACTIONS = [
  { id: 1, label: "Monthly Saver deposit", date: "2026-07-12", grams: 1.42, amount: 8600, type: "credit" },
  { id: 2, label: "Gold rate bonus", date: "2026-07-08", grams: 0.06, amount: 360, type: "credit" },
  { id: 3, label: "Redeemed — Tulip Studs", date: "2026-06-29", grams: -3.1, amount: -18750, type: "debit" },
  { id: 4, label: "Monthly Saver deposit", date: "2026-06-12", grams: 1.38, amount: 8350, type: "credit" },
  { id: 5, label: "Flexi Save top-up", date: "2026-06-02", grams: 0.9, amount: 5450, type: "credit" },
  { id: 6, label: "Redeemed — Layered Chain", date: "2026-05-18", grams: -7.5, amount: -45300, type: "debit" },
  { id: 7, label: "Monthly Saver deposit", date: "2026-05-12", grams: 1.4, amount: 8480, type: "credit" },
  { id: 8, label: "Lumpsum deposit", date: "2026-04-30", grams: 5.0, amount: 30100, type: "credit" },
];

const FILTERS = [
  { id: "all", label: "All" },
  { id: "credit", label: "Deposits" },
  { id: "debit", label: "Redemptions" },
];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function monthKey(iso) {
  return new Date(iso).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

export default function TransactionsPage() {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return TRANSACTIONS.filter((t) => {
      const matchesFilter = filter === "all" || t.type === filter;
      const matchesQuery = t.label.toLowerCase().includes(query.trim().toLowerCase());
      return matchesFilter && matchesQuery;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [filter, query]);

  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach((t) => {
      const key = monthKey(t.date);
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });
    return groups;
  }, [filtered]);

  const totals = useMemo(() => {
    const credited = TRANSACTIONS.filter((t) => t.type === "credit")
      .reduce((sum, t) => sum + t.amount, 0);
    const debited = TRANSACTIONS.filter((t) => t.type === "debit")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const netGrams = TRANSACTIONS.reduce((sum, t) => sum + t.grams, 0);
    return { credited, debited, netGrams };
  }, []);

  return (
    <div className="gv-scope gv-tx">
      <div className="gv-tx-main">
        <div className="gv-tx-head">
          <div>
            <p className="gv-eyebrow">Ledger</p>
            <h1>Transactions</h1>
          </div>
          <button className="gv-btn gv-btn-outline-dark gv-tx-export">
            <Download size={16} /> Export statement
          </button>
        </div>

        {/* Summary strip */}
        <div className="gv-tx-summary">
          <div className="gv-tx-summary-card">
            <span className="gv-tx-summary-label">Total deposited</span>
            <span className="gv-tx-summary-value positive">
              ₹{totals.credited.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="gv-tx-summary-card">
            <span className="gv-tx-summary-label">Total redeemed</span>
            <span className="gv-tx-summary-value negative">
              ₹{totals.debited.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="gv-tx-summary-card">
            <span className="gv-tx-summary-label">Net gold held</span>
            <span className="gv-tx-summary-value">{totals.netGrams.toFixed(2)}g</span>
          </div>
        </div>

        {/* Controls */}
        <div className="gv-tx-controls">
          <div className="gv-tx-filters">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                className={`gv-tx-filter${filter === f.id ? " active" : ""}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="gv-tx-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search transactions"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Grouped ledger */}
        {Object.keys(grouped).length === 0 ? (
          <div className="gv-tx-empty">No transactions match your search.</div>
        ) : (
          Object.entries(grouped).map(([month, items]) => (
            <div className="gv-tx-group" key={month}>
              <h3 className="gv-tx-group-title">{month}</h3>
              <div className="gv-ledger-card">
                {items.map((t) => (
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
                        <div className="gv-ledger-date">{formatDate(t.date)}</div>
                      </div>
                    </div>
                    <div className="gv-ledger-right">
                      <div
                        className={`gv-ledger-amount ${
                          t.type === "credit" ? "positive" : "negative"
                        }`}
                      >
                        {t.grams > 0 ? "+" : ""}
                        {t.grams.toFixed(2)}g
                      </div>
                      <div className="gv-ledger-sub">
                        {t.amount > 0 ? "+" : "-"}₹
                        {Math.abs(t.amount).toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
