import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { AuthService } from "@/features/auth/auth.service"
import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"
import { z } from "zod"
import EmailOtp from "./email-otp"

export const loginFormSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
})

export default function LoginForm() {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
  })
  const navigate = useNavigate()

  const [verifyEmail, setVerifyEmail] = useState("")
  const [verifyEmailError, setVerifyEmailError] = useState(false)

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    try {
      console.log(values)
      await AuthService.login(values)
      toast("Login effettuato")
      navigate("/")
    } catch (error) {
      console.error("Form submission error", error)
      console.dir(error)
      toast.error(
        error instanceof AxiosError
          ? error.response?.data.message
          : "Errore del server, riprova!"
      )
      if (
        error instanceof AxiosError &&
        error.response?.data.cause === "EMAIL_NOT_VERIFIED"
      ) {
        setVerifyEmailError(true)
      }
    }
  }

  if (verifyEmail) {
    return <EmailOtp emailVerify={verifyEmail} />
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mx-auto max-w-3xl space-y-4"
    >
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          id="email"
          placeholder="mario.rossi@example.com"
          inputMode="email"
          {...form.register("email")}
        />

        <FieldError>{form.formState.errors.email?.message}</FieldError>
        {verifyEmailError && (
          <FieldError>
            Email non verificata,{" "}
            <span
              className="cursor-pointer underline"
              onClick={() => setVerifyEmail(form.getValues("email"))}
            >
              clicca qui!
            </span>
          </FieldError>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <Input
          id="password"
          placeholder="********"
          type="password"
          {...form.register("password")}
        />

        <FieldError>{form.formState.errors.password?.message}</FieldError>
      </Field>

      <Link to="/password-recovery" className="inline-block">
        Password dimenticata?
      </Link>

      <Button type="submit" className={"w-full"}>
        Accedi
      </Button>
    </form>
  )
}
