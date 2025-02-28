import { FcGoogle } from "react-icons/fc";
import { Button } from "./ui/button";
import { BsPersonWalking } from "react-icons/bs";
import { useAuthContext } from "@/context/AuthContext";

export default function Login() {
  const { login } = useAuthContext();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-800">
      <div className="w-full max-w-md px-4">
        <div className="w-full rounded-xl overflow-hidden shadow-2xl">
          {/* カードヘッダー - グラデーション部分 */}
          <div className="text-white h-16 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
            <h1 className="text-2xl font-bold"> WalkBuddy</h1>
          </div>

          {/* カード本体 */}
          <div className="bg-white p-6 space-y-6">
            {/* ロゴ部分 */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center">
                <BsPersonWalking className="text-white h-10 w-10" />
              </div>
            </div>

            {/* Googleログインボタン */}
            <Button
              onClick={login}
              variant="outline"
              className="w-full h-12 flex items-center justify-center gap-2 border-2 hover:bg-purple-50 transition-colors"
            >
              <FcGoogle className="h-5 w-5" />
              <span>Googleでログイン</span>
            </Button>

            {/* 切り替え */}
          </div>
        </div>
      </div>
    </div>
  );
}
