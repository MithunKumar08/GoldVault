import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Search,
  Download,
} from "lucide-react";

import "../theme.css";
import "../transaction/Transaction.css";
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


function monthKey(iso) {
  if (!iso) return "";

  return new Date(iso).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}


/* -------------------------------------------------- */
/* Status helpers                                      */
/* -------------------------------------------------- */

const MAX_TRANSACTIONS = 10;

function getStatusInfo(status) {

  const key = String(status || "").toUpperCase();

  if (key === "SUCCESS") {
    return {
      tone: "success",
      icon: ArrowUpRight,
    };
  }

  if (key === "FAILED") {
    return {
      tone: "failed",
      icon: ArrowDownRight,
    };
  }

  /* Anything else (PENDING, IN_PROGRESS, PROCESSING, etc.) */

  return {
    tone: "pending",
    icon: Clock,
  };

}


const FILTERS = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "success",
    label: "Successful",
  },
  {
    id: "failed",
    label: "Failed",
  },
];


export default function TransactionsPage() {

  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);


  /* -------------------------------------------------- */
  /* Fetch transactions                                  */
  /* -------------------------------------------------- */

  useEffect(() => {

    const getTransactions = async () => {

      try {

        setLoading(true);

        const response =
          await ApiService.getAllTransactions();

        console.log("Transactions:", response);

        setTransactions(response || []);

      } catch (error) {

        console.error(
          "Error fetching transactions:",
          error
        );

        setTransactions([]);

      } finally {

        setLoading(false);

      }

    };

    getTransactions();

  }, []);


  /* -------------------------------------------------- */
  /* Filter + Search                                     */
  /* -------------------------------------------------- */

  const filteredTransactions = useMemo(() => {

    return transactions.filter((transaction) => {

      /* Status filter */

      if (
        filter === "success" &&
        transaction.status !== "SUCCESS"
      ) {
        return false;
      }

      if (
        filter === "failed" &&
        transaction.status !== "FAILED"
      ) {
        return false;
      }


      /* Search */

      if (query.trim() !== "") {

        const searchText = query
          .toLowerCase()
          .trim();

        return (
          transaction.sessionId
            ?.toLowerCase()
            .includes(searchText) ||

          transaction.status
            ?.toLowerCase()
            .includes(searchText) ||

          transaction.productName
            ?.toLowerCase()
            .includes(searchText)
        );
      }

      return true;

    });

  }, [transactions, filter, query]);


  /* Cap the visible list to the most recent MAX_TRANSACTIONS entries */

  const visibleTransactions = useMemo(
    () => filteredTransactions.slice(0, MAX_TRANSACTIONS),
    [filteredTransactions]
  );


  /* -------------------------------------------------- */
  /* Summary                                             */
  /* -------------------------------------------------- */

  const totals = useMemo(() => {

    const credited = transactions
      .filter(
        (t) => t.status === "SUCCESS"
      )
      .reduce(
        (total, t) =>
          total + Number(t.amount || 0),
        0
      );

    return {
      credited,
    };

  }, [transactions]);


  return (
    <div className="gv-scope gv-tx">

      <main className="gv-tx-main">

        {/* ------------------------------------------------ */}
        {/* Header                                           */}
        {/* ------------------------------------------------ */}

        <div className="gv-tx-head">

          <div>

            <p className="gv-eyebrow">
              Ledger
            </p>

            <h1>
              Transactions
            </h1>

          </div>

        </div>


        {/* ------------------------------------------------ */}
        {/* Summary                                          */}
        {/* ------------------------------------------------ */}

        <div className="gv-tx-summary">

          <div className="gv-tx-summary-card">

            <span className="gv-tx-summary-label">
              Total deposited
            </span>

            <span className="gv-tx-summary-value positive">
              ₹{totals.credited.toLocaleString("en-IN")}
            </span>

          </div>

        </div>


        {/* ------------------------------------------------ */}
        {/* Controls                                         */}
        {/* ------------------------------------------------ */}

        <div className="gv-tx-controls">

          <div className="gv-tx-filters">

            {FILTERS.map((f) => (

              <button
                key={f.id}
                className={`gv-tx-filter${
                  filter === f.id
                    ? " active"
                    : ""
                }`}
                onClick={() =>
                  setFilter(f.id)
                }
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
              onChange={(e) =>
                setQuery(e.target.value)
              }
            />

          </div>

        </div>


        {/* ------------------------------------------------ */}
        {/* Transactions (capped at MAX_TRANSACTIONS)        */}
        {/* ------------------------------------------------ */}

        <div className="gv-tx-list">

          {loading ? (

            <div className="gv-empty-state">
              Loading transactions...
            </div>

          ) : visibleTransactions.length === 0 ? (

            <div className="gv-empty-state">
              No transactions found.
            </div>

          ) : (

            visibleTransactions.map((t) => {

              const { tone, icon: StatusIcon } = getStatusInfo(t.status);

              return (

                <div
                  className="gv-tx-row"
                  key={t.id || t.sessionId}
                >

                  {/* Left */}

                  <div className="gv-tx-left">

                    <span className={`gv-ledger-dot ${tone}`}>
                      <StatusIcon size={14} />
                    </span>


                    <div>

                      <div className="gv-ledger-label">
                        {t.productName || "Gold Investment"}
                      </div>

                      <div className="gv-ledger-date">
                        {formatDate(t.transactionTime)}
                      </div>

                      <div className="gv-ledger-date">
                        {t.sessionId}
                      </div>

                    </div>

                  </div>


                  {/* Right */}

                  {/* <div className="gv-ledger-right"> */}

                    <div className={`gv-tx-amount ${tone}`}>
                      ₹{Number(t.amount || 0).toLocaleString("en-IN")}
                    </div>

                    <div className={`gv-ledger-sub ${tone}`}>
                      {t.status}
                    </div>

                  {/* </div> */}

                </div>

              );

            })

          )}

        </div>

      </main>

    </div>
  );
}
