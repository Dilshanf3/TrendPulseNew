"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="mb-1 font-serif text-2xl font-semibold tracking-wide text-charcoal">Reset Password</h1>
      <p className="mb-8 text-sm text-charcoal-soft">Enter your email and we&apos;ll send you a reset link.</p>

      {submitted ? (
        <p className="text-sm text-emerald-700">If an account exists for {email}, a reset link has been sent.</p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
          </div>
          <Button type="submit" size="lg">Send Reset Link</Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-charcoal-soft">
        <Link href="/login" className="font-semibold text-charcoal hover:text-gold-dark">Back to sign in</Link>
      </p>
    </div>
  );
}
