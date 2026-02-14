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
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Minimum length is 8"),
});

export function LoginForm(props: React.ComponentProps<typeof Card>) {
  /* -------------------- */
  /* Google Login Handler */
  /* -------------------- */
  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "http://localhost:3000",
      });
    } catch (error) {
      toast.error("Google login failed");
    }
  };

  /* -------------------- */
  /* React Form Setup     */
  /* -------------------- */
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Logging in...");
      try {
        const { data, error } = await authClient.signIn.email(value);

        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        }

        toast.success("User logged in successfully", { id: toastId });
        console.log("Login success:", data);
      } catch (err) {
        toast.error("Something went wrong, please try again.", {
          id: toastId,
        });
      }
    },
  });

  /* -------------------- */
  /* UI                  */
  /* -------------------- */
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email and password to login
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="login-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            {/* ---------- Email ---------- */}
            <form.Field name="email">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched &&
                  !field.state.meta.isValid;

                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
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
                  <Field>
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
          form="login-form"
          type="submit"
          className="w-full"
        >
          Login
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






















































// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Field,
//   FieldError,
//   FieldGroup,
//   FieldLabel,
// } from "@/components/ui/field";
// import { Input } from "@/components/ui/input";
// import { authClient } from "@/lib/auth-client";
// import { useForm } from "@tanstack/react-form";
// import { toast } from "sonner";
// import * as z from "zod";

// const formSchema = z.object({
//   password: z.string().min(8, "Minimum length is 8"),
//   email: z.email(),
// });

// export function LoginForm({ ...props }: React.ComponentProps<typeof Card>) {
//   const handleGoogleLogin = async () => {
//     const data = authClient.signIn.social({
//       provider: "google",
//       callbackURL: "http://localhost:3000",
//     });

//     console.log(data);
//   };

//   const form = useForm({
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//     validators: {
//       onSubmit: formSchema,
//     },
//     onSubmit: async ({ value }) => {
//       const toastId = toast.loading("Logging in");
//       try {
//         const { data, error } = await authClient.signIn.email(value);

//         if (error) {
//           toast.error(error.message, { id: toastId });
//           return;
//         }

//         toast.success("User Logged in Successfully", { id: toastId });
//       } catch (err) {
//         toast.error("Something went wrong, please try again.", { id: toastId });
//       }
//     },
//   });

//   return (
//     <Card {...props}>
//       <CardHeader>
//         <CardTitle>Create an account</CardTitle>
//         <CardDescription>
//           Enter your information below to create your account
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form
//           id="login-form"
//           onSubmit={(e) => {
//             e.preventDefault();
//             form.handleSubmit();
//           }}
//         >
//           <FieldGroup>
//             <form.Field
//               name="email"
//               children={(field) => {
//                 const isInvalid =
//                   field.state.meta.isTouched && !field.state.meta.isValid;
//                 return (
//                   <Field>
//                     <FieldLabel htmlFor={field.name}>Email</FieldLabel>
//                     <Input
//                       type="email"
//                       id={field.name}
//                       name={field.name}
//                       value={field.state.value}
//                       onChange={(e) => field.handleChange(e.target.value)}
//                     />
//                     {isInvalid && (
//                       <FieldError errors={field.state.meta.errors} />
//                     )}
//                   </Field>
//                 );
//               }}
//             />
//             <form.Field
//               name="password"
//               children={(field) => {
//                 const isInvalid =
//                   field.state.meta.isTouched && !field.state.meta.isValid;
//                 return (
//                   <Field>
//                     <FieldLabel htmlFor={field.name}>Password</FieldLabel>
//                     <Input
//                       type="password"
//                       id={field.name}
//                       name={field.name}
//                       value={field.state.value}
//                       onChange={(e) => field.handleChange(e.target.value)}
//                     />
//                     {isInvalid && (
//                       <FieldError errors={field.state.meta.errors} />
//                     )}
//                   </Field>
//                 );
//               }}
//             />
//           </FieldGroup>
//         </form>
//       </CardContent>
//       <CardFooter className="flex flex-col gap-5 justify-end">
//         <Button form="login-form" type="submit" className="w-full">
//           Login
//         </Button>
//         <Button
//           onClick={() => handleGoogleLogin()}
//           variant="outline"
//           type="button"
//           className="w-full"
//         >
//           Continue with Google
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// }





































// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   Field,
//   FieldDescription,
//   FieldGroup,
//   FieldLabel,
// } from "@/components/ui/field"
// import { Input } from "@/components/ui/input"

// export function LoginForm({
//   className,
//   ...props
// }: React.ComponentProps<"div">) {
//   return (
//     <div className={cn("flex flex-col gap-6", className)} {...props}>
//       <Card>
//         <CardHeader>
//           <CardTitle>Login to your account</CardTitle>
//           <CardDescription>
//             Enter your email below to login to your account
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form>
//             <FieldGroup>
//               <Field>
//                 <FieldLabel htmlFor="email">Email</FieldLabel>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="m@example.com"
//                   required
//                 />
//               </Field>
//               <Field>
//                 <div className="flex items-center">
//                   <FieldLabel htmlFor="password">Password</FieldLabel>
//                   <a
//                     href="#"
//                     className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
//                   >
//                     Forgot your password?
//                   </a>
//                 </div>
//                 <Input id="password" type="password" required />
//               </Field>
//               <Field>
//                 <Button type="submit">Login</Button>
//                 <Button variant="outline" type="button">
//                   Login with Google
//                 </Button>
//                 <FieldDescription className="text-center">
//                   Don&apos;t have an account? <a href="#">Sign up</a>
//                 </FieldDescription>
//               </Field>
//             </FieldGroup>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
