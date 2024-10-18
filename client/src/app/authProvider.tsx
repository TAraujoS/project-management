import React from "react";
import { Authenticator, Placeholder } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { I18n } from "aws-amplify/utils";
import { translations } from "@aws-amplify/ui-react";
import Image from "next/image";
I18n.putVocabularies(translations);
I18n.setLanguage("pt");

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
      userPoolClientId:
        process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || "",
    },
  },
});

const formFields = {
  signUp: {
    username: {
      order: 1,
      placeholder: "Insira um usuário",
      label: "Username",
      inputProps: { required: true },
    },
    email: {
      order: 2,
      placeholder: "Insira um email",
      label: "Email",
      inputProps: { type: "email", required: true },
    },
    password: {
      order: 3,
      placeholder: "Insira uma senha",
      label: "Password",
      inputProps: { type: "password", required: true },
    },
    confirm_password: {
      order: 4,
      placeholder: "Confirme sua senha",
      label: "Password",
      inputProps: { type: "password", required: true },
    },
  },
  signIn: {
    username: {
      order: 1,
      placeholder: "Insira um usuário",
      label: "Username",
      inputProps: { required: true },
    },
    password: {
      order: 2,
      placeholder: "Insira uma senha",
      label: "Password",
      inputProps: { type: "password", required: true },
    },
  },
};

const AuthProvider = ({ children }: any) => {
  return (
    <div className="mon-h-screen flex h-full w-full items-center justify-center gap-1 bg-white">
      <div className="flex min-h-screen w-full flex-col justify-center gap-10 pb-14">
        <div className="-mt-12">
          <Image
            src="/logo.png"
            alt="Logo"
            width={150}
            height={150}
            className="mx-auto"
          />
          <h1 className="mx-12 text-center text-2xl font-semibold text-gray-900">
            <strong>
              Faça com que todos trabalhem em uma única plataforma
            </strong>{" "}
            projetada para gerenciar qualquer tipo de trabalho.
          </h1>
        </div>
        <Authenticator formFields={formFields}>
          {({ user }: any) =>
            user ? (
              <div>{children}</div>
            ) : (
              <div>
                <h1>Please Sign In below:</h1>
              </div>
            )
          }
        </Authenticator>
      </div>

      <div className="sticky top-0 flex h-screen w-full items-center justify-center bg-cyan-700 max-lg:hidden">
        <iframe
          width={500}
          height={500}
          src="https://lottie.host/embed/f1a8b120-9ab3-4957-ab3b-f713c3c9916a/pRodU2YQJA.json"
        />
      </div>
    </div>
  );
};

export default AuthProvider;
