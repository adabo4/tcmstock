import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MailCheck } from "lucide-react";
import AuthLayout from "../../layouts/AuthLayout";
import {
  resendVerificationCodeRequest,
  verifyEmailRequest,
} from "../../api/auth";

type LocationState = {
  email?: string;
};

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState | null;

  const [email, setEmail] = useState(state?.email ?? "");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  async function handleResendCode() {
    setError("");
    setResendMessage("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    try {
      setResendLoading(true);

      const response = await resendVerificationCodeRequest(
        email.trim().toLowerCase(),
      );

      setResendMessage(response.message || "Nový overovací kód bol odoslaný.");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Overovací kód sa nepodarilo odoslať znova.",
      );
    } finally {
      setResendLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Email je povinný.");
      return;
    }

    if (code.trim().length !== 6) {
      setError("Overovací kód musí obsahovať 6 číslic.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await verifyEmailRequest(email.trim(), code.trim());

      setMessage(response.message || "E-mail bol úspešne overený.");

      setTimeout(() => {
        navigate("/sign-in");
      }, 1200);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Overenie e-mailu zlyhalo.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div>
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <MailCheck size={42} />
        </div>

        <h2 className="text-5xl font-bold text-slate-950">Overenie e-mailu</h2>

        <p className="mt-4 text-xl text-slate-500">
          Zadajte 6-miestny kód, ktorý sme vám poslali na e-mail.
        </p>

        <form onSubmit={handleSubmit} className="mt-12 space-y-7">
          <div>
            <label className="mb-3 block font-semibold text-slate-950">
              E-mail
            </label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="meno@priklad.sk"
              className="h-16 w-full rounded-xl border border-slate-300 px-5 text-lg outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div>
            <label className="mb-3 block font-semibold text-slate-950">
              Overovací kód
            </label>
            <input
              value={code}
              onChange={(event) =>
                setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              inputMode="numeric"
              placeholder="123456"
              className="h-16 w-full rounded-xl border border-slate-300 px-5 text-center text-3xl font-bold tracking-[0.5em] outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 font-medium text-red-700">
              {error}
            </p>
          )}

          {message && (
            <p className="rounded-xl bg-green-50 px-4 py-3 font-medium text-green-700">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="h-16 w-full rounded-xl bg-blue text-xl font-semibold text-white shadow-lg hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isLoading ? "Overujem..." : "Overiť e-mail"}
          </button>

          <button
            type="button"
            disabled={resendLoading}
            onClick={handleResendCode}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 font-semibold text-primary transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {resendLoading ? "Odosielam..." : "Odoslať nový overovací kód"}
          </button>

          {resendMessage && (
            <p className="rounded-xl bg-green-50 px-4 py-3 font-medium text-green-700">
              {resendMessage}
            </p>
          )}

          <p className="text-center text-sm leading-6 text-slate-500">
            Ak vám kód stále neprišiel, kontaktujte nás na{" "}
            <a
              href="mailto:support@tcmstock.com"
              className="font-semibold text-primary"
            >
              support@tcmstock.com
            </a>
          </p>
        </form>

        <p className="mt-10 text-center text-lg text-slate-500">
          E-mail už máte overený?{" "}
          <Link to="/sign-in" className="font-semibold text-primary">
            Prihláste sa
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
