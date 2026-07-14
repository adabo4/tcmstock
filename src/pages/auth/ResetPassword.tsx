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
        setError("Chýba token na obnovenie hesla.");
        return;
      }

      if (!newPassword.trim()) {
        setError("Nové heslo je povinné.");
        return;
      }

      if (newPassword.trim().length < 6) {
        setError("Heslo musí obsahovať aspoň 6 znakov.");
        return;
      }

      if (newPassword !== confirmPassword) {
        setError("Heslá sa nezhodujú.");
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
        setError("Nepodarilo sa obnoviť heslo.");
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
          Späť na prihlásenie
        </Link>

        <h2 className="text-5xl font-bold text-slate-950">Obnovenie hesla</h2>
        <p className="mt-4 text-xl text-slate-500">
          Zadajte nové heslo pre svoj účet.
        </p>

        <form onSubmit={handleSubmit} className="mt-12 space-y-8">
          <div>
            <label className="mb-3 block font-semibold text-slate-950">
              Nové heslo
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
              Potvrdenie hesla
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
            {loading ? "Obnovujem heslo..." : "Obnoviť heslo"}
          </button>
        </form>

        <p className="mt-10 text-center text-lg text-slate-500">
          Spomenuli ste si na heslo?{" "}
          <Link to="/sign-in" className="font-semibold text-primary">
            Prihláste sa
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
