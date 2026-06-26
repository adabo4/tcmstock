import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MailCheck } from "lucide-react";
import AuthLayout from "../../layouts/AuthLayout";
import { verifyEmailRequest } from "../../api/auth";

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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (code.trim().length !== 6) {
      setError("Verification code must have 6 digits.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await verifyEmailRequest(email.trim(), code.trim());

      setMessage(response.message || "Email verified successfully.");

      setTimeout(() => {
        navigate("/sign-in");
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
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

        <h2 className="text-5xl font-bold text-slate-950">Verify email</h2>

        <p className="mt-4 text-xl text-slate-500">
          Enter the 6-digit code we sent to your email.
        </p>

        <form onSubmit={handleSubmit} className="mt-12 space-y-7">
          <div>
            <label className="mb-3 block font-semibold text-slate-950">
              Email
            </label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="you@example.com"
              className="h-16 w-full rounded-xl border border-slate-300 px-5 text-lg outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div>
            <label className="mb-3 block font-semibold text-slate-950">
              Verification code
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
            className="h-16 w-full rounded-xl bg-primary text-xl font-semibold text-white shadow-lg hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isLoading ? "Verifying..." : "Verify email"}
          </button>
        </form>

        <p className="mt-10 text-center text-lg text-slate-500">
          Already verified?{" "}
          <Link to="/sign-in" className="font-semibold text-primary">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
