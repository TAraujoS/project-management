"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { authFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import CustomInput from "../CustomInput";
import { Form } from "../Form";
import { useSignupMutation, useSigninMutation } from "@/state/api/api";
import toast from "react-hot-toast";

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [createUser, { isLoading }] = useSignupMutation();
  const [login] = useSigninMutation();
  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      if (type === "sign-up") {
        const userData = {
          username: data.username,
          email: data.email,
          password: data.password,
        };
        const response = await createUser(userData);
        if (response.data) {
          router.push("/sign-in");
        }
      }

      if (type === "sign-in") {
        const response = await login({
          email: data.email,
          password: data.password,
        });
        if (response.data) {
          toast.success("Login efetuado com sucesso!");
          router.push("/");
        } else {
          toast.error("Usuário ou senha inválidos");
        }
      }
    } catch (error) {
      toast.error("Erro ao efetuar login");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen w-full max-w-[420px] flex-col justify-center gap-5 py-8 md:gap-8">
      <header className="flex flex-col gap-5 md:gap-8">
        <div className="flex flex-col items-center gap-1">
          <Image src="/logo.png" alt="logo" width={150} height={150} />
          <h1 className="w-full text-2xl font-semibold text-blue-900">
            <strong>
              Faça com que todos trabalhem em uma única plataforma
            </strong>{" "}
            projetada para gerenciar qualquer tipo de trabalho.
          </h1>
        </div>

        <div className="flex flex-col gap-1 text-center md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {type === "sign-in" ? "Entrar" : "Cadastrar-se"}
            <p className="text-16 font-normal text-gray-600">
              Por favor entre com seus dados
            </p>
          </h1>
        </div>
      </header>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {type === "sign-up" && (
            <>
              <CustomInput
                control={form.control}
                name="username"
                label="Nome de Usuário"
                placeholder="Insira seu Nome de Usuário"
              />
            </>
          )}
          <CustomInput
            control={form.control}
            name="email"
            label="Email"
            placeholder="Insira o seu Email"
          />
          <CustomInput
            control={form.control}
            name="password"
            label="Senha"
            placeholder="Insira a sua Senha"
          />
          <div className="flex flex-col gap-4">
            <button type="submit" className="form-btn" disabled={loading}>
              {loading || isLoading ? (
                <>
                  <Loader2 className="animate-spin" /> &nbsp;Carregando...
                </>
              ) : type === "sign-in" ? (
                "Entrar"
              ) : (
                "Cadastrar"
              )}
            </button>
          </div>
        </form>

        <footer className="flex justify-center gap-1">
          <p className="text-14 font-normal text-gray-600">
            {type === "sign-in"
              ? "Não possui uma conta?"
              : "Ja possui uma conta?"}
          </p>
          <Link
            href={type === "sign-in" ? "/sign-up" : "/sign-in"}
            className="form-link"
          >
            {type === "sign-in" ? "Cadastrar" : "Entrar"}
          </Link>
        </footer>
      </Form>
    </section>
  );
};

export default AuthForm;
