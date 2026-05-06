import { loginFormSchema } from "@/components/login-form"
import { http } from "@/lib/http"
import type z from "zod"
import { useAuthStore } from "./auth.store"
import type { registerSchema } from "@/components/register-form"
import type { User } from "../users/users.type"

export class AuthService {
  static async login(data: z.infer<typeof loginFormSchema>) {
    const res = await http.post("/auth/login", data)
    console.log(res)
    const { token, user } = res.data
    if (!token) {
      throw new Error("Token non valido")
    }
    useAuthStore.getState().login(user, token)
    return res
  }

  static async me() {
    const token = useAuthStore.getState().token
    return http.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  static async register(data: z.infer<typeof registerSchema>) {
    const res = await http.post("/auth/register", data)
    return res
  }

  static async verifyEmail(data: { email: string; code: string }) {
    const res = await http.post<{ token: string; user: User }>(
      "/auth/email-verify",
      data
    )
    if (res.data.token) {
      useAuthStore.getState().login(res.data.user, res.data.token)
    }
    return res
  }

  static async resendEmailVerify(email: string) {
    return http.post("/auth/resend-email-verify", { email })
  }
}
