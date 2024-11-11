import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="mon-h-screen font-inter flex w-full justify-between">
      {children}
      <div className="auth-asset">
        <div>
          <iframe
            width={700}
            height={700}
            src="https://lottie.host/embed/f1a8b120-9ab3-4957-ab3b-f713c3c9916a/pRodU2YQJA.json"
          />
        </div>
      </div>
    </main>
  );
}
