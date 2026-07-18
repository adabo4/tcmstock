import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type PasswordInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function PasswordInput({
  value,
  onChange,
  placeholder = "••••••••",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-w-0 w-full items-center">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className="h-16 min-w-0 flex-1 bg-transparent px-3 sm:px-4 text-lg outline-none"
      />

      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="text-slate-500 hover:text-slate-800 shrink-0"
      >
        {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
      </button>
    </div>
  );
}
