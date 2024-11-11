import React from "react";
import AuthForm from "@/components/AuthForm";

const SignUp = async () => {
  return (
    <section className="flex size-full justify-center max-sm:px-6">
      <AuthForm type="sign-up" />
    </section>
  );
};

export default SignUp;
