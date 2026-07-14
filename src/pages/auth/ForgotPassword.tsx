import { ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { useState } from "react";
import { forgotPasswordRequest } from "../../api/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setError("");
      setMessage("");
      setLoading(true);

      if (!email.trim()) {
        setError("Email je povinný.");
        return;
      }

      const emailRegex = /\S+@\S+\.\S+/;

      if (!emailRegex.test(email)) {
        setError("Zadajte platnú e-mailovú adresu.");
        return;
      }

      const data = await forgotPasswordRequest(email.trim());

      setMessage(
        data.message ||
          "Ak účet s týmto e-mailom existuje, poslali sme vám pokyny na obnovenie hesla.",
      );
      setEmail("");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Kód na obnovenie hesla sa nepodarilo odoslať.");
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

        <h2 className="text-5xl font-bold text-slate-950">
          Zabudli ste heslo?
        </h2>

        <p className="mt-4 text-xl text-slate-500">
          Zadajte svoj e-mail a pošleme vám kód na obnovenie hesla.
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
                placeholder="meno@priklad.sk"
                className="h-16 flex-1 bg-transparent px-4 text-lg outline-none"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 p-4 text-red-600">{error}</p>
          )}

          {message && (
            <p className="rounded-xl bg-green-50 p-4 text-green-600">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-16 w-full rounded-xl bg-blue text-xl font-semibold text-white shadow-lg hover:bg-primary-hover disabled:opacity-50"
          >
            {loading ? "Odosielam..." : "Odoslať kód"}
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
