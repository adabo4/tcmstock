import {
  Eye,
  EyeOff,
  Lock,
  Settings as SettingsIcon,
  Trash2,
  User,
} from "lucide-react";
import { useAuth } from "../context/useAuth";
import { useState, type FormEvent } from "react";
import { deleteAccountRequest, updateNameRequest } from "../api/auth";
import { useNotification } from "../context/useNotification";
import { changePasswordRequest } from "../api/auth";
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import StockLocationsSettings from "../components/settings/StockLocationSettings";
import type { AppLayoutOutletContext } from "../layouts/AppLayout";
import MobileMenuButton from "../components/ui/MobileMenuButton";

export default function Settings() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameError, setNameError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  const section = searchParams.get("section");

  const { openSidebar } = useOutletContext<AppLayoutOutletContext>();

  const activeTab: "profile" | "stock" =
    section === "stock-locations" ? "stock" : "profile";

  const navigate = useNavigate();
  const { signOut } = useAuth();

  const { showNotification } = useNotification();

  async function handleNameSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (trimmedName && trimmedName.length < 2) {
      setNameError("Meno musí obsahovať aspoň 2 znaky.");
      return;
    }

    try {
      setIsSavingName(true);
      setNameError("");

      const response = await updateNameRequest(
        trimmedName === "" ? null : trimmedName,
      );

      updateUser(response.user);
      showNotification(
        trimmedName
          ? "Meno používateľa bolo zmenené."
          : "Meno používateľa bolo odstránené.",
        "success",
      );

      console.log(response.message);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Nepodarilo sa aktualizovať meno.";

      setNameError(message);
    } finally {
      setIsSavingName(false);
    }
  }

  async function handlePasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Prosím vyplňte všetky polia.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Nové heslá sa nezhodujú.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Nové heslo musí obsahovať aspoň 6 znakov.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError("Nové heslo sa musí odlišovať od súčasného.");
      return;
    }

    try {
      setIsChangingPassword(true);

      const response = await changePasswordRequest(
        currentPassword,
        newPassword,
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setPasswordSuccess(response.message);
      showNotification("Heslo bolo úspešne zmenené.", "success");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Nepodarilo sa zmeniť heslo.";

      setPasswordError(message);
    } finally {
      setIsChangingPassword(false);
    }
  }

  async function handleDeleteAccount() {
    try {
      setIsDeleting(true);
      setDeleteError("");

      await deleteAccountRequest();

      signOut();
      navigate("/sign-in", { replace: true });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Nepodarilo sa odstrániť účet.";

      setDeleteError(message);
    } finally {
      setIsDeleting(false);
    }
  }
  return (
    <div>
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="mb-8">
          <div className="mb-6 flex items-center gap-3">
            <MobileMenuButton onClick={openSidebar} />

            <div className="min-w-0">
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Nastavenia
              </h1>

              <p className="mt-1 text-sm text-slate-500 sm:text-base">
                Spravujte svoj účet a sklady
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-blue">
              AB
            </div>

            <div>
              <p className="text-lg font-bold text-slate-950">{user?.name}</p>
              <p className="text-slate-500">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 flex gap-8 border-b border-slate-200">
        <div className="mb-8 flex gap-8 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setSearchParams({})}
            className={`border-b-2 px-1 pb-4 font-semibold transition ${
              activeTab === "profile"
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Profil
          </button>

          <button
            type="button"
            onClick={() => setSearchParams({ section: "stock-locations" })}
            className={`border-b-2 px-1 pb-4 font-semibold transition ${
              activeTab === "stock"
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Nastavenia skladu
          </button>
        </div>
      </div>

      {activeTab === "profile" && (
        <div className="grid gap-6 xl:grid-cols-3">
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <CardHeader
              icon={<User />}
              title="Údaje profilu"
              subtitle="Aktualizujte svoje osobné údaje"
            />

            <form className="mt-8 space-y-6" onSubmit={handleNameSubmit}>
              <label className="block">
                <span className="mb-2 block font-semibold text-slate-800">
                  Meno a priezvisko:
                </span>

                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="h-14 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </label>

              <label className="block">
                <span className="mb-2 block font-semibold text-slate-800">
                  Email:
                </span>

                <input
                  value={user?.email ?? ""}
                  disabled
                  className="h-14 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 text-slate-500 outline-none"
                />
              </label>

              {nameError && (
                <p className="text-sm font-medium text-red-600">{nameError}</p>
              )}

              <button
                type="submit"
                disabled={isSavingName}
                className="mt-8 h-14 w-full rounded-xl bg-blue font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingName ? "Ukladám..." : "Uložiť zmeny"}
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <CardHeader
              icon={<Lock />}
              title="Zmena hesla"
              subtitle="Aktualizovať heslo"
            />

            <form className="mt-8 space-y-6" onSubmit={handlePasswordSubmit}>
              <PasswordInput
                label="Aktuálne heslo:"
                value={currentPassword}
                onChange={setCurrentPassword}
                autoComplete="current-password"
              />

              <PasswordInput
                label="Nové heslo:"
                value={newPassword}
                onChange={setNewPassword}
                autoComplete="new-password"
              />

              <PasswordInput
                label="Potvrdenie:"
                value={confirmPassword}
                onChange={setConfirmPassword}
                autoComplete="new-password"
              />

              {passwordError && (
                <p className="text-sm font-medium text-red-600">
                  {passwordError}
                </p>
              )}

              {passwordSuccess && (
                <p className="text-sm font-medium text-green-600">
                  {passwordSuccess}
                </p>
              )}

              <button
                type="submit"
                disabled={isChangingPassword}
                className="mt-8 h-14 w-full rounded-xl bg-blue font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isChangingPassword ? "Ukladám..." : "Uložiť heslo"}
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <CardHeader
              icon={<SettingsIcon />}
              title="Účet"
              subtitle="Nastavenia účtu"
            />

            <div className="mt-12 rounded-2xl border border-red-200 bg-red-50 p-6">
              <div className="flex items-center gap-3 font-bold text-red-600">
                <Trash2 size={20} />
                Nebezpečná zóna
              </div>

              <p className="mt-4 leading-relaxed text-slate-600">
                Odstránenie účtu je trvalé a nie je možné ho vrátiť späť.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-red-300 px-6 font-semibold text-red-600 hover:bg-red-50"
            >
              <Trash2 size={20} />
              Vymazať účet
            </button>
          </section>
        </div>
      )}

      {activeTab === "stock" && <StockLocationsSettings />}

      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          onMouseDown={() => setShowDeleteConfirm(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <Trash2 size={26} />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-950">
              Naozaj zmazať účet?
            </h2>

            <p className="mt-3 leading-relaxed text-slate-600">
              Váš účet a všetky vaše údaje budú vymazané. Táto akcia sa nedá
              zvrátiť.
            </p>

            {deleteError && (
              <p className="mt-4 text-sm font-medium text-red-600">
                {deleteError}
              </p>
            )}

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="h-12 flex-1 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Zrušiť
              </button>

              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="h-12 flex-1 rounded-xl bg-red-600 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? "Vymazávam..." : "Zmazať účet"}
              </button>
            </div>
          </div>
        </div>
      )}
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

type PasswordInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
};

function PasswordInput({
  label,
  value,
  onChange,
  autoComplete,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <label className="block">
      <span className="mb-2 block font-semibold text-slate-800">{label}</span>

      <div className="flex h-14 items-center rounded-xl border border-slate-200 px-4 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          className="min-w-0 flex-1 bg-transparent outline-none"
        />

        <button
          type="button"
          onClick={() => setShowPassword((current) => !current)}
          className="ml-3 text-slate-500 hover:text-slate-800"
          aria-label={showPassword ? "Skryť heslo" : "Zobraziť heslo"}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </label>
  );
}
