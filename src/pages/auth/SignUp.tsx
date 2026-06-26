import { Eye, Lock, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";

export default function SignUp() {
  return (
    <AuthLayout>
      <div>
        <h2 className="text-5xl font-bold text-slate-950">
          Create your account
        </h2>
        <p className="mt-4 text-xl text-slate-500">Sign up to get started</p>

        <form className="mt-12 space-y-8">
          <div>
            <label className="mb-3 block font-semibold text-slate-950">
              Full Name
            </label>
            <div className="flex items-center rounded-xl border border-slate-300 px-5">
              <User className="text-slate-500" size={24} />
              <input
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

          <button
            type="submit"
            className="h-16 w-full rounded-xl bg-blue-700 text-xl font-semibold text-white shadow-lg hover:bg-blue-800"
          >
            Sign up
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
