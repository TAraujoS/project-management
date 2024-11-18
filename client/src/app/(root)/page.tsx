"use client";

import { useGetAuthUserQuery } from "@/state/api/api";
import HomePage from "./home/page";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { currentData, isLoading } = useGetAuthUserQuery();
  const token = localStorage.getItem("@user:token");
  const router = useRouter();

  useEffect(() => {
    if (!currentData || !token) {
      router.push("/sign-in");
    }
  }, [currentData, token]);

  if (isLoading)
    return (
      <div>
        <iframe
          width={700}
          height={700}
          src="https://lottie.host/embed/f1a8b120-9ab3-4957-ab3b-f713c3c9916a/pRodU2YQJA.json"
          className="mx-auto"
        />
      </div>
    );
  return currentData && <HomePage />;
}
