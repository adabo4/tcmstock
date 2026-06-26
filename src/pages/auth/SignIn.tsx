import { Eye, Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";

export default function SignIn() {
  return (
    <AuthLayout>
      <div>
        <h2 className="text-5xl font-bold text-slate-950">Sign in</h2>
        <p className="mt-4 text-xl text-slate-500">
          Welcome back! Please sign in to your account.
        </p>

        <form className="mt-12 space-y-8">
          <div>
            <label className="mb-3 block font-semibold text-slate-950">
              Email
            </label>
            <div className="flex items-center rounded-xl border border-slate-300 px-5">
              <Mail className="text-slate-500" size={24} />
              <input
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
              <input
                type="password"
                placeholder="••••••••"
                className="h-16 flex-1 bg-transparent px-4 text-lg outline-none"
              />
              <Eye className="text-slate-500" size={24} />
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

          <button
            type="submit"
            className="h-16 w-full rounded-xl bg-blue-700 text-xl font-semibold text-white shadow-lg hover:bg-blue-800"
          >
            Sign in
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
