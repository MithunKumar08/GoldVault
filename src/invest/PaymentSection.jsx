import { useState, useMemo } from "react";
import { CreditCard, Lock, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const CARD_BRANDS = [
  { name: "visa", pattern: /^4/, label: "Visa" },
  { name: "mastercard", pattern: /^(5[1-5]|2[2-7])/, label: "Mastercard" },
  { name: "amex", pattern: /^3[47]/, label: "Amex" },
  { name: "discover", pattern: /^6(011|5)/, label: "Discover" },
];

function detectBrand(number) {
  const digits = number.replace(/\s/g, "");
  return CARD_BRANDS.find((b) => b.pattern.test(digits))?.label ?? null;
}

function formatCardNumber(value) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function luhnCheck(number) {
  const digits = number.replace(/\D/g, "");
  if (digits.length < 13) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i], 10);
    if (shouldDouble) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

function validateExpiry(value) {
  const match = value.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;
  const month = parseInt(match[1], 10);
  const year = parseInt(match[2], 10) + 2000;
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const expiryDate = new Date(year, month - 1, 1);
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  return expiryDate >= currentMonthStart;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PaymentSection({
  amount = 129.0,
  currency = "USD",
  onSubmit,
}) {
  const [fields, setFields] = useState({
    name: "",
    number: "",
    expiry: "",
    cvc: "",
  });
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [serverError, setServerError] = useState("");

  const brand = useMemo(() => detectBrand(fields.number), [fields.number]);

  const errors = useMemo(() => {
    const e = {};
    if (!fields.name.trim()) e.name = "Enter the name on the card.";
    if (!luhnCheck(fields.number)) e.number = "Enter a valid card number.";
    if (!validateExpiry(fields.expiry)) e.expiry = "Enter a valid, unexpired date.";
    const cvcLen = brand === "Amex" ? 4 : 3;
    if (!new RegExp(`^\\d{${cvcLen}}$`).test(fields.cvc))
      e.cvc = `Enter a ${cvcLen}-digit security code.`;
    return e;
  }, [fields, brand]);

  const isValid = Object.keys(errors).length === 0;

  function updateField(key, raw) {
    let value = raw;
    if (key === "number") value = formatCardNumber(raw);
    if (key === "expiry") value = formatExpiry(raw);
    if (key === "cvc") value = raw.replace(/\D/g, "").slice(0, 4);
    setFields((f) => ({ ...f, [key]: value }));
  }

  function markTouched(key) {
    setTouched((t) => ({ ...t, [key]: true }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ name: true, number: true, expiry: true, cvc: true });
    setServerError("");
    if (!isValid) return;

    setStatus("submitting");
    try {
      if (onSubmit) {
        // Caller is responsible for tokenizing/charging via their backend or
        // a provider SDK (e.g. Stripe Elements). Never send raw card data to
        // your own server or log it.
        await onSubmit({ ...fields, brand });
      } else {
        await new Promise((res) => setTimeout(res, 1200));
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setServerError(err?.message ?? "Payment failed. Please try again.");
    }
  }

  const showError = (key) => touched[key] && errors[key];

  if (status === "success") {
    return (
      <div className="w-full max-w-md mx-auto rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
        <h3 className="mt-4 text-lg font-semibold text-emerald-900">
          Payment successful
        </h3>
        <p className="mt-1 text-sm text-emerald-700">
          Charged {currency} {amount.toFixed(2)} to card ending in{" "}
          {fields.number.slice(-4)}.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full max-w-md mx-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900">Payment details</h2>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Lock className="h-3.5 w-3.5" />
          Secure checkout
        </div>
      </div>

      <div className="mb-5 flex items-baseline justify-between rounded-lg bg-slate-50 px-4 py-3">
        <span className="text-sm text-slate-600">Amount due</span>
        <span className="text-xl font-semibold text-slate-900">
          {currency} {amount.toFixed(2)}
        </span>
      </div>

      <div className="space-y-4">
        <Field label="Name on card" error={showError("name")}>
          <input
            type="text"
            autoComplete="cc-name"
            value={fields.name}
            onChange={(e) => updateField("name", e.target.value)}
            onBlur={() => markTouched("name")}
            placeholder="Jane Doe"
            className={inputClass(showError("name"))}
          />
        </Field>

        <Field label="Card number" error={showError("number")}>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              value={fields.number}
              onChange={(e) => updateField("number", e.target.value)}
              onBlur={() => markTouched("number")}
              placeholder="1234 5678 9012 3456"
              className={inputClass(showError("number")) + " pr-16"}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
              {brand ?? <CreditCard className="h-4 w-4" />}
            </span>
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Expiry" error={showError("expiry")}>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp"
              value={fields.expiry}
              onChange={(e) => updateField("expiry", e.target.value)}
              onBlur={() => markTouched("expiry")}
              placeholder="MM/YY"
              className={inputClass(showError("expiry"))}
            />
          </Field>

          <Field label="CVC" error={showError("cvc")}>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="cc-csc"
              value={fields.cvc}
              onChange={(e) => updateField("cvc", e.target.value)}
              onBlur={() => markTouched("cvc")}
              placeholder="123"
              className={inputClass(showError("cvc"))}
            />
          </Field>
        </div>
      </div>

      {status === "error" && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 w-full rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
      >
        {status === "submitting"
          ? "Processing…"
          : `Pay ${currency} ${amount.toFixed(2)}`}
      </button>

      <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
        <ShieldCheck className="h-3.5 w-3.5" />
        Payments are encrypted and never stored on our servers.
      </div>
    </form>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

function inputClass(hasError) {
  return [
    "w-full rounded-lg border px-3 py-2.5 text-sm text-slate-900 outline-none transition",
    "focus:ring-2 focus:ring-offset-0",
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-slate-300 focus:border-slate-400 focus:ring-slate-100",
  ].join(" ");
}
