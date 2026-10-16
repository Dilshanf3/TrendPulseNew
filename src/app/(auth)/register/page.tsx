"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthFooter, AuthHeader } from "@/components/account/auth-form";
import { safeCallbackUrl } from "@/lib/utils";

function RegisterForm() {
  const router = useRouter();
  const callbackUrl = safeCallbackUrl(useSearchParams().get("callbackUrl"));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error ?? "Could not create account");
      setIsSubmitting(false);
      return;
    }

    await signIn("credentials", { email, password, redirect: false });
    setIsSubmitting(false);
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <>
      <AuthHeader title="Create an account" description="Faster checkout, order tracking and a wishlist that follows you." />

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} className="mt-2" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2"
            aria-describedby="password-hint"
          />
          <p id="password-hint" className="mt-1.5 text-xs text-muted">
            At least 8 characters.
          </p>
        </div>
        <Button type="submit" size="lg" loading={isSubmitting} className="mt-2">
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <AuthFooter prompt="Already have an account?" linkLabel="Sign in" href="/login" />
    </>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
