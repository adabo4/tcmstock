import {
  Eye,
  Lock,
  Monitor,
  Settings as SettingsIcon,
  Shield,
  Trash2,
  User,
} from "lucide-react";

export default function Settings() {
  return (
    <div>
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-950">Settings</h1>
          <p className="mt-2 text-lg text-slate-500">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
              AB
            </div>

            <div>
              <p className="text-lg font-bold text-slate-950">
                Adriana Bohunicka
              </p>
              <p className="text-slate-500">Admin</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 flex gap-8 border-b border-slate-200">
        <button className="border-b-2 border-primary px-1 pb-4 font-semibold text-primary">
          Profile
        </button>
        <button className="px-1 pb-4 font-semibold text-slate-500 hover:text-slate-900">
          Notifications
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <CardHeader
            icon={<User />}
            title="Profile Information"
            subtitle="Update your personal information"
          />

          <form className="mt-8 space-y-6">
            <Input label="Full Name" defaultValue="Adriana Bohunicka" />
            <Input label="Email" defaultValue="adriana@example.com" />

            <button
              type="button"
              className="mt-8 h-14 w-full rounded-xl bg-primary font-semibold text-white hover:bg-primary-hover"
            >
              Save Changes
            </button>
          </form>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <CardHeader
            icon={<Lock />}
            title="Change Password"
            subtitle="Update your password"
          />

          <form className="mt-8 space-y-6">
            <PasswordInput label="Current Password" />
            <PasswordInput label="New Password" />
            <PasswordInput label="Confirm New Password" />

            <button
              type="button"
              className="mt-8 h-14 w-full rounded-xl bg-primary font-semibold text-white hover:bg-primary-hover"
            >
              Update Password
            </button>
          </form>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <CardHeader
            icon={<SettingsIcon />}
            title="Account"
            subtitle="Manage your account"
          />

          <div className="mt-12 rounded-2xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-center gap-3 font-bold text-red-600">
              <Trash2 size={20} />
              Danger Zone
            </div>

            <p className="mt-4 leading-relaxed text-slate-600">
              Once you delete your account, there is no going back.
            </p>
          </div>

          <button
            type="button"
            className="mt-6 flex h-14 items-center justify-center gap-2 rounded-xl border border-red-300 px-6 font-semibold text-red-600 hover:bg-red-50"
          >
            <Trash2 size={20} />
            Delete Account
          </button>
        </section>
      </div>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <CardHeader
            icon={<Shield />}
            title="Account Security"
            subtitle="Keep your account secure"
          />

          <div className="rounded-full bg-green-50 px-5 py-2 font-semibold text-green-700">
            Everything looks good
          </div>

          <button className="flex h-14 items-center justify-center gap-3 rounded-xl border border-slate-200 px-6 font-semibold text-slate-700 hover:bg-slate-50">
            <Monitor size={20} />
            Manage Sessions
          </button>
        </div>
      </section>
    </div>
  );
}

type CardHeaderProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
};

function CardHeader({ icon, title, subtitle }: CardHeaderProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-950">{title}</h2>
        <p className="mt-1 text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

type InputProps = {
  label: string;
  defaultValue?: string;
};

function Input({ label, defaultValue }: InputProps) {
  return (
    <label className="block">
      <span className="mb-2 block font-semibold text-slate-800">{label}</span>
      <input
        defaultValue={defaultValue}
        className="h-14 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
      />
    </label>
  );
}

function PasswordInput({ label }: { label: string }) {
  return (
    <label className="block">
      <span className="mb-2 block font-semibold text-slate-800">{label}</span>

      <div className="flex h-14 items-center rounded-xl border border-slate-200 px-4 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
        <input
          type="password"
          defaultValue="password"
          className="flex-1 bg-transparent outline-none"
        />
        <Eye size={20} className="text-slate-500" />
      </div>
    </label>
  );
}
