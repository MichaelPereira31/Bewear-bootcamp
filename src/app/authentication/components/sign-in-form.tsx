"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

import { PasswordInput } from "./password-input";

type FormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  email: z.email("Email invalido").min(2).max(50),
  password: z
    .string()
    .min(8, { error: "Senha deve ter no minimo 8 caractes" })
    .max(50),
});

const SignInForm = () => {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: FormValues) {
    const { email, password } = values;
    await authClient.signIn.email({
      password,
      email,
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
        onError: (err) => {
          if (err.error.code === "INVALID_EMAIL_OR_PASSWORD") {
            toast.error("E-mail ou senha invalida");
            return;
          }
          toast.error(err.error.message);
        },
      },
    });
  }

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
      });
    } catch {
      toast.error("Erro ao fazer login com Google");
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>Faça login para continuar</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu email" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <PasswordInput
                      id="password"
                      placeholder="Digite sua senha"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex w-full flex-col gap-4">
            <Button type="submit" className="w-full">
              Entrar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              className="w-full"
            >
              Entrar com Google
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default SignInForm;
