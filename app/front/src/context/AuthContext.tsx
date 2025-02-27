"use client";

import { initializeApp } from "firebase/app";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import Login from "@/components/Login";

type AuthContextType = {
  user: User | null | undefined;
  login: () => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export function useAuthContext() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const firebaseConfig = {
    apiKey: "AIzaSyBN-sIZx-rSCZ2nrjZFZhS4qIo1K1r2tLs",
    authDomain: "gabaithon202502saga2.firebaseapp.com",
    projectId: "gabaithon202502saga2",
    storageBucket: "gabaithon202502saga2.firebasestorage.app",
    messagingSenderId: "328048708813",
    appId: "1:328048708813:web:e4e38562abb11647c86d84",
    measurementId: "G-26GBYYVT0S",
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const login = async () => {
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => setUser(user));
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {user ? children : user === null ? <Login /> : <div>loading...</div>}
    </AuthContext.Provider>
  );
}
