"use client";

import { useGetAuthUserQuery } from "@/state/api/api";
import HomePage from "./home/page";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const token = localStorage.getItem("@user:token");
  const { currentData, isLoading } = useGetAuthUserQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (!token) {
      router.push("/sign-in");
    }
  }, [token, router]);

  if (isLoading)
    return (
      <div className="mx-auto mt-10">
        <h1 className="text-center text-xl font-semibold">Carregando...</h1>
        <iframe
          width={700}
          height={700}
          src="https://lottie.host/embed/f1a8b120-9ab3-4957-ab3b-f713c3c9916a/pRodU2YQJA.json"
        />
      </div>
    );
  return currentData && <HomePage />;
}
