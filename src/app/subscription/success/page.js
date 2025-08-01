"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/Subscriptions");
    }, 3000); // Redirect after 3 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Payment Successful!</h1>
      <p>Thank you for your subscription. Redirecting to your subscriptions page...</p>
    </div>
  );
}
