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
    <>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className="h-16 flex-1 bg-transparent px-4 text-lg outline-none"
      />

      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="text-slate-500 hover:text-slate-800"
      >
        {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
      </button>
    </>
  );
}
