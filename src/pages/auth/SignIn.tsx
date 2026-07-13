import { Lock, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { resendVerificationCodeRequest, signInRequest } from "../../api/auth";
import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import PasswordInput from "../../components/PasswordInput";
import { ApiError } from "../../lib/api";

export default function SignIn() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  async function handleOpenVerification() {
    if (!unverifiedEmail) return;

    try {
      setError("");
      setResendLoading(true);

      await resendVerificationCodeRequest(unverifiedEmail);

      navigate("/verify-email", {
        state: {
          email: unverifiedEmail,
        },
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to resend verification code.",
      );
    } finally {
      setResendLoading(false);
    }
  }

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setUnverifiedEmail("");

    try {
      setLoading(true);

      const response = await signInRequest(
        email.trim().toLowerCase(),
        password,
      );

      signIn(response.accessToken, response.user);

      navigate("/dashboard");
    } catch (error) {
      if (error instanceof ApiError && error.code === "EMAIL_NOT_VERIFIED") {
        setError("Your email is not verified.");
        setUnverifiedEmail(error.email || email.trim().toLowerCase());

        return;
      }

      setError(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <AuthLayout>
      <div>
        <h2 className="text-5xl font-bold text-slate-950">Sign in</h2>
        <p className="mt-4 text-xl text-slate-500">
          Welcome back! Please sign in to your account.
        </p>

        <form onSubmit={handleSignIn} className="mt-12 space-y-8">
          <div>
            <label className="mb-3 block font-semibold text-slate-950">
              Email
            </label>
            <div className="flex items-center rounded-xl border border-slate-300 px-5">
              <Mail className="text-slate-500" size={24} />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@example.com"
                className="h-16 flex-1 bg-transparent px-4 text-lg outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-3 block font-semibold text-slate-950">
              Password
            </label>
            <div className="flex items-center rounded-xl border border-slate-300 px-5">
              <Lock className="text-slate-500" size={24} />

              <PasswordInput value={password} onChange={setPassword} />
            </div>
          </div>

          <div className="flex items-center justify-between text-base">
            <Link to="/forgot-password" className="font-medium text-blue-700">
              Forgot password?
            </Link>
          </div>
          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 font-medium text-red-700">
              {error}
            </p>
          )}

          {unverifiedEmail && (
            <button
              type="button"
              disabled={resendLoading}
              onClick={handleOpenVerification}
              className="w-full rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 font-semibold text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {resendLoading
                ? "Sending verification code..."
                : "Verify email or resend code"}
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="h-16 w-full rounded-xl bg-blue text-xl font-semibold text-white shadow-lg hover:bg-primary-hover disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-10 text-center text-lg text-slate-500">
          Don&apos;t have an account?{" "}
          <Link to="/sign-up" className="font-semibold text-blue-700">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
