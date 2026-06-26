import { Lock, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { signInRequest } from "../../api/auth";
import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import PasswordInput from "../../components/PasswordInput";

export default function SignIn() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const response = await signInRequest(email, password);

      signIn(response.accessToken, response.user);

      navigate("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed.");
      }
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

        <form onSubmit={handleSubmit} className="mt-12 space-y-8">
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
            <label className="flex items-center gap-3 text-slate-700">
              <input type="checkbox" className="h-5 w-5 rounded" />
              Remember me
            </label>

            <Link to="/forgot-password" className="font-medium text-blue-700">
              Forgot password?
            </Link>
          </div>
          {error && (
            <p className="rounded-xl bg-red-50 p-4 text-red-600">{error}</p>
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
