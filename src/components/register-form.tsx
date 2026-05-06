import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { AuthService } from "@/features/auth/auth.service"
import { useState } from "react"
import { EyeClosed, EyeIcon } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"
import EmailOtp from "./email-otp"

export const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email(),
  password: z.string(),
  passwordConfirmation: z.string(),
  termsAndConditions: z.boolean(),
})

export default function RegisterForm() {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  })

  const [emailVerify, setEmailVerify] = useState("")

  const [showPsw, setShowPsw] = useState(false)
  const [showConfPsw, setShowConfPsw] = useState(false)

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    try {
      console.log(values)
      await AuthService.register(values)
      setEmailVerify(values.email)
    } catch (error) {
      console.error("Form submission error", error)
      toast.error("Failed to submit the form. Please try again.")
    }
  }

  if (emailVerify) {
    return <EmailOtp emailVerify={emailVerify} />
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mx-auto max-w-3xl space-y-4"
    >
      <Field>
        <FieldLabel htmlFor="firstName">Nome</FieldLabel>
        <Input
          id="firstName"
          placeholder="Mario"
          {...form.register("firstName")}
        />

        <FieldError>{form.formState.errors.firstName?.message}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor="lastName">cognome</FieldLabel>
        <Input
          id="lastName"
          placeholder="Rossi"
          {...form.register("lastName")}
        />

        <FieldError>{form.formState.errors.lastName?.message}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          id="email"
          placeholder="mario.rossi@example.com"
          inputMode="email"
          {...form.register("email")}
        />

        <FieldError>{form.formState.errors.email?.message}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="password"
            placeholder="********"
            type={showPsw ? "text" : "password"}
            {...form.register("password")}
          />

          <InputGroupAddon
            className="cursor-pointer"
            align={"inline-end"}
            onClick={() => setShowPsw(!showPsw)}
          >
            {showPsw ? <EyeClosed /> : <EyeIcon />}
          </InputGroupAddon>
        </InputGroup>

        <FieldError>{form.formState.errors.password?.message}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor="passwordConfirmation">
          Conferma password
        </FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="passwordConfirmation"
            placeholder="********"
            type={showConfPsw ? "text" : "password"}
            {...form.register("passwordConfirmation")}
          />

          <InputGroupAddon
            className="cursor-pointer"
            align={"inline-end"}
            onClick={() => setShowConfPsw(!showConfPsw)}
          >
            {showConfPsw ? <EyeClosed /> : <EyeIcon />}
          </InputGroupAddon>
        </InputGroup>

        <FieldError>
          {form.formState.errors.passwordConfirmation?.message}
        </FieldError>
      </Field>
      <Field className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
        <Checkbox
          id="termsAndConditions"
          className={"w-4!"}
          // {...form.register("termsAndConditions")}
          checked={form.watch("termsAndConditions")}
          onCheckedChange={(value) =>
            form.setValue("termsAndConditions", value)
          }
        />
        <div className="space-y-1 leading-none">
          <FieldLabel htmlFor="termsAndConditions">
            Termini e condizioni
          </FieldLabel>
          <FieldDescription>
            Attivando la checkbox accetti i termini e le condizioni
          </FieldDescription>
          <FieldError>
            {form.formState.errors.termsAndConditions?.message}
          </FieldError>
        </div>
      </Field>
      <Button
        type="submit"
        className={"w-full"}
        disabled={form.formState.isSubmitting}
      >
        Registrati
      </Button>
    </form>
  )
}
