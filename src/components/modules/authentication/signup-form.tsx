"use client";

import * as React from "react";
import * as z from "zod";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { GraduationCap, BookOpen, Eye, EyeOff } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

// ================= TYPES =================
type UserRole = "STUDENT" | "TUTOR";

type SignUpEmailParams = Parameters<typeof authClient.signUp.email>[0] & {
  role: UserRole;
};

// ================= VALIDATION =================
const formSchema = z.object({
  name: z.string().min(1, "This field is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Minimum length is 8"),
});

// ================= ROLE CARD =================
function RoleCard({
  role,
  selected,
  onSelect,
  icon,
  title,
  description,
}: {
  role: UserRole;
  selected: UserRole;
  onSelect: (role: UserRole) => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  const isSelected = selected === role;
  return (
    <button
      type="button"
      onClick={() => onSelect(role)}
      className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer text-center
        ${isSelected
          ? "border-primary bg-primary/10"
          : "border-border bg-muted/30 hover:border-primary/40 hover:bg-muted/60"
        }`}
    >
      <div
        className={`p-2 rounded-full ${
          isSelected
            ? "bg-primary/20 text-primary"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {icon}
      </div>
      <p className={`font-semibold text-sm ${isSelected ? "text-primary" : "text-foreground"}`}>
        {title}
      </p>
      <p className="text-xs text-muted-foreground leading-tight">{description}</p>
    </button>
  );
}

// ================= SIGNUP FORM =================
export function SignupForm(props: React.ComponentProps<typeof Card>) {
  const [selectedRole, setSelectedRole] = React.useState<UserRole>("STUDENT");
  // ✅ password show/hide state
  const [showPassword, setShowPassword] = React.useState(false);

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({ provider: "google" });
    } catch {
      toast.error("Google signup failed");
    }
  };

  const form = useForm({
    defaultValues: { name: "", email: "", password: "" },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Creating account...");
      try {
        const payload: SignUpEmailParams = {
          name: value.name,
          email: value.email,
          password: value.password,
          role: selectedRole,
        };

        const { data, error } = await authClient.signUp.email(payload);

        if (error) {
          toast.error(error.message ?? "Signup failed", { id: toastId });
          return;
        }

        toast.success(
          `Account created as ${selectedRole}! Please check your email to verify.`,
          { id: toastId }
        );
        console.log("Signup success:", data);
      } catch {
        toast.error("Something went wrong, please try again.", { id: toastId });
      }
    },
  });

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* ===== ROLE SELECTION ===== */}
        <div>
          <p className="text-sm font-medium mb-3">I want to join as</p>
          <div className="flex gap-3">
            <RoleCard
              role="STUDENT"
              selected={selectedRole}
              onSelect={setSelectedRole}
              icon={<GraduationCap className="size-5" />}
              title="Student"
              description="I want to learn and book sessions"
            />
            <RoleCard
              role="TUTOR"
              selected={selectedRole}
              onSelect={setSelectedRole}
              icon={<BookOpen className="size-5" />}
              title="Tutor"
              description="I want to teach and offer services"
            />
          </div>
        </div>

        {/* ===== FORM FIELDS ===== */}
        <form
          id="signup-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            {/* Name */}
            <form.Field name="name">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>

            {/* Email */}
            <form.Field name="email">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>

            {/* ✅ Password with Eye Icon */}
            <form.Field name="password">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    {/* wrapper div for relative positioning */}
                    <div className="relative">
                      <Input
                        id={field.name}
                        name={field.name}
                        // ✅ showPassword true হলে text, false হলে password
                        type={showPassword ? "text" : "password"}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        // eye icon এর জন্য right padding বাড়ানো
                        className="pr-10"
                      />
                      {/* Eye toggle button */}
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        // screen reader এর জন্য
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        <p className="text-xs text-muted-foreground w-full text-center">
          Registering as{" "}
          <span className="font-semibold text-primary">{selectedRole}</span>
        </p>

        <Button form="signup-form" type="submit" className="w-full">
          Register as {selectedRole === "STUDENT" ? "Student" : "Tutor"}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleLogin}
          className="w-full"
        >
          Continue with Google
        </Button>
      </CardFooter>
    </Card>
  );
}


















