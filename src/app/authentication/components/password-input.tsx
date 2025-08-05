"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";

interface PasswordInputProps {
  id?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export function PasswordInput({
  id,
  placeholder = "Digite sua senha",
  value,
  onChange,
  className,
  disabled,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  const handleVisible = () => {
    setVisible(!visible);
  };

  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={className}
        disabled={disabled}
      />
      <span
        onClick={handleVisible}
        className="absolute top-0 right-0 flex h-full items-center justify-center px-3 hover:cursor-pointer hover:bg-transparent"
      >
        {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      </span>
    </div>
  );
}
