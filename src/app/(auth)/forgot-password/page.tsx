"use client";

import { useState } from "react";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthFooter, AuthHeader } from "@/components/account/auth-form";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <AuthHeader title="Reset your password" description="Enter your email and we'll send you a reset link." />

      {submitted ? (
        <div role="status" className="flex gap-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">
          <MailCheck className="h-5 w-5 shrink-0" />
          <p>If an account exists for {email}, a reset link has been sent.</p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="flex flex-col gap-5"
        >
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2" />
          </div>
          <Button type="submit" size="lg">
            Send reset link
          </Button>
        </form>
      )}

      <AuthFooter linkLabel="Back to sign in" href="/login" />
    </>
  );
}
