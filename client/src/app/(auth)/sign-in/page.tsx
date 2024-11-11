import React from "react";
import AuthForm from "@/components/AuthForm";

const SignIn = async () => {
  return (
    <section className="flex size-full justify-center max-sm:px-6">
      <AuthForm type="sign-in" />
    </section>
  );
};

export default SignIn;
