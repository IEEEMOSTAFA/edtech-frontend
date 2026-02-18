"use client";

import * as React from "react";
import * as z from "zod";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

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

/* -------------------- */
/* Zod Validation Schema */
/* -------------------- */
const formSchema = z.object({
  name: z.string().min(1, "This field is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Minimum length is 8"),
});

export function SignupForm(
  props: React.ComponentProps<typeof Card>
) {
  /* -------------------- */
  /* Google Signup Handler */
  /* -------------------- */
  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        // callbackURL: "http://localhost:3000",
        // Tested:
        
      });
    } catch (error) {
      toast.error("Google signup failed");
    }
  };

  /* -------------------- */
  /* React Form Setup     */
  /* -------------------- */
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Creating user...");
      try {
        const { data, error } =
          await authClient.signUp.email(value);

        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        }

        toast.success("User created successfully", {
          id: toastId,
        });
        console.log("Signup success:", data);
      } catch (err) {
        toast.error(
          "Something went wrong, please try again.",
          { id: toastId }
        );
      }
    },
  });

  /* -------------------- */
  /* UI                  */
  /* -------------------- */
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="signup-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            {/* ---------- Name ---------- */}
            <form.Field name="name">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched &&
                  !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Name
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(e.target.value)
                      }
                    />
                    {isInvalid && (
                      <FieldError
                        errors={field.state.meta.errors}
                      />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* ---------- Email ---------- */}
            <form.Field name="email">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched &&
                  !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Email
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(e.target.value)
                      }
                    />
                    {isInvalid && (
                      <FieldError
                        errors={field.state.meta.errors}
                      />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* ---------- Password ---------- */}
            <form.Field name="password">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched &&
                  !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Password
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(e.target.value)
                      }
                    />
                    {isInvalid && (
                      <FieldError
                        errors={field.state.meta.errors}
                      />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <Button
          form="signup-form"
          type="submit"
          className="w-full"
        >
          Register
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
