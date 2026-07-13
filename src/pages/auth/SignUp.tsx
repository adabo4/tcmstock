import { Lock, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { useState } from "react";
import { signUpRequest } from "../../api/auth";
import PasswordInput from "../../components/PasswordInput";

export default function SignUp() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const response = await signUpRequest(name, email, password);

      navigate("/verify-email", {
        state: {
          email: response.email,
        },
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <AuthLayout>
      <div>
        <h2 className="text-5xl font-bold text-slate-950">
          Create your account
        </h2>
        <p className="mt-4 text-xl text-slate-500">Sign up to get started</p>

        <form onSubmit={handleSubmit} className="mt-12 space-y-8">
          <div>
            <label className="mb-3 block font-semibold text-slate-950">
              Full Name
            </label>
            <div className="flex items-center rounded-xl border border-slate-300 px-5">
              <User className="text-slate-500" size={24} />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Your name"
                className="h-16 flex-1 bg-transparent px-4 text-lg outline-none"
              />
            </div>
          </div>

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
              <PasswordInput
                value={password}
                onChange={setPassword}
              ></PasswordInput>
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 p-4 text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-16 w-full rounded-xl bg-blue text-xl font-semibold text-white shadow-lg hover:bg-primary-hover disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-10 text-center text-lg text-slate-500">
          Already have an account?{" "}
          <Link to="/sign-in" className="font-semibold text-blue-700">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
