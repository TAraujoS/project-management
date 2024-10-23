import React from "react";
import {
  Authenticator,
  Theme,
  ThemeProvider,
  useTheme,
  View,
} from "@aws-amplify/ui-react";
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
      label: "Confirm Password",
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
  const { tokens } = useTheme();

  const theme: Theme = {
    name: "authenticator",
    tokens: {
      components: {
        authenticator: {
          router: {
            boxShadow: `0 0 16px ${tokens.colors.blue["20"]}`,
            borderWidth: "0",
          },
          form: {
            padding: `${tokens.space.medium} ${tokens.space.xl} ${tokens.space.medium}`,
          },
        },
        button: {
          primary: {
            backgroundColor: tokens.colors.blue["60"],
          },
          link: {
            color: tokens.colors.blue["80"],
          },
        },
        fieldcontrol: {
          _focus: {
            boxShadow: `0 0 0 2px ${tokens.colors.blue["20"]}`,
          },
        },
        tabs: {
          item: {
            color: tokens.colors.blue["40"],
            _active: {
              borderColor: tokens.colors.blue["80"],
              color: tokens.colors.blue["100"],
            },
            _focus: {
              color: tokens.colors.blue["100"],
            },
            _hover: {
              color: tokens.colors.blue["80"],
            },
          },
        },
      },
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <View>
        <Authenticator
          formFields={formFields}
          components={{
            Header() {
              return (
                <div className="my-10 text-center">
                  <Image
                    src="https://pm-s3-th-images.s3.us-east-1.amazonaws.com/logo.png"
                    alt="Logo"
                    width={150}
                    height={150}
                    className="mx-auto"
                  />
                  <h1 className="w-full text-2xl font-semibold text-blue-900">
                    <strong>
                      Faça com que todos trabalhem em uma única plataforma
                    </strong>{" "}
                    projetada para gerenciar qualquer tipo de trabalho.
                  </h1>
                </div>
              );
            },
          }}
        >
          {({ user }: any) =>
            user ? (
              <div>{children}</div>
            ) : (
              <div>
                <h1>Por favor efetue o login:</h1>
              </div>
            )
          }
        </Authenticator>
      </View>
    </ThemeProvider>
  );
};

export default AuthProvider;
