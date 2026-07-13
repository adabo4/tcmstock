import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import PasswordInput from "../../components/PasswordInput";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { resetPasswordRequest } from "../../api/auth";
import { useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setMessage("");

      if (!token) {
        setError("Reset token is missing.");
        return;
      }

      if (!newPassword.trim()) {
        setError("New password is required.");
        return;
      }

      if (newPassword.trim().length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }

      if (newPassword !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      const response = await resetPasswordRequest(token, newPassword.trim());

      setMessage(response.message);

      setTimeout(() => {
        navigate("/sign-in");
      }, 1500);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Reset password failed.");
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <AuthLayout>
      <div>
        <Link
          to="/sign-in"
          className="mb-10 inline-flex items-center gap-2 font-semibold text-slate-500 hover:text-primary"
        >
          <ArrowLeft size={20} />
          Back to sign in
        </Link>

        <h2 className="text-5xl font-bold text-slate-950">Reset password</h2>

        <form onSubmit={handleSubmit} className="mt-12 space-y-8">
          <div>
            <label className="mb-3 block font-semibold text-slate-950">
              New password
            </label>

            <div className="flex items-center rounded-xl border border-slate-300 px-5">
              <PasswordInput
                value={newPassword}
                onChange={setNewPassword}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label className="mb-3 block font-semibold text-slate-950">
              Confirm password
            </label>

            <div className="flex items-center rounded-xl border border-slate-300 px-5">
              <PasswordInput
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 p-4 text-red-600">{error}</p>
          )}
          {message ? (
            <p className="rounded-xl bg-green-50 p-4 text-green-600">
              {message}
            </p>
          ) : null}

          <button type="submit" disabled={loading}>
            {loading ? "Resetting password..." : "Reset password"}
          </button>
        </form>

        <p className="mt-10 text-center text-lg text-slate-500">
          Remember your password?{" "}
          <Link to="/sign-in" className="font-semibold text-primary">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
