"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-[#f5f5f7] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[360px] bg-white rounded-2xl shadow-lg p-8"
      >
        <h1 className="text-[22px] font-bold text-[#2A2475] text-center mb-1">
          COGNIO Admin
        </h1>
        <p className="text-[13px] text-[#8c89b4] text-center mb-8">
          마케팅 대시보드
        </p>

        <div className="flex flex-col gap-3 mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
            required
            className="w-full px-4 py-3 rounded-xl text-[14px] border border-[#d0cfe1] outline-none focus:border-[#3E67C8] transition-colors"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            required
            className="w-full px-4 py-3 rounded-xl text-[14px] border border-[#d0cfe1] outline-none focus:border-[#3E67C8] transition-colors"
          />
        </div>

        {error && (
          <p className="text-[13px] text-red-500 text-center mb-3">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#2A2475] text-white rounded-xl text-[14px] font-semibold hover:bg-[#1e1a5e] transition-colors disabled:opacity-50"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
