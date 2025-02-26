"use client";

import { useAuthContext } from "@/context/AuthContext";

export default function Page() {
  const { logout } = useAuthContext();

  return (
    <main className="h-screen bg-white">
      <button onClick={logout}>ログアウト</button>
    </main>
  );
}
