"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import type { CartItemData } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [items, setItems] = useState<CartItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    guestEmail: "",
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    shippingMethod: "Standard" as "Standard" | "Express",
    paymentMethod: "COD" as "COD" | "CARD",
    notes: "",
  });

  useEffect(() => {
    fetch("/api/cart")
      .then((res) => res.json())
      .then((data) => setItems(data.items ?? []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (session?.user?.email) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- prefill contact email once session loads
      setForm((f) => (f.guestEmail ? f : { ...f, guestEmail: session.user!.email! }));
    }
  }, [session]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingFee = form.shippingMethod === "Express" ? 1200 : subtotal >= 5000 ? 0 : 600;
  const total = subtotal + shippingFee;

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setIsSubmitting(false);

    if (!res.ok) {
      toast.error(data.error ?? "Could not place order");
      return;
    }

    toast.success("Order placed successfully!");
    router.push(`/account/orders?success=${data.orderNumber}`);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner className="h-6 w-6 text-charcoal-soft/60" />
      </div>
    );
  }

  if (items.length === 0) {
    return <div className="py-24 text-center text-sm text-charcoal-soft">Your cart is empty. Add items before checking out.</div>;
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 lg:px-8">
      <h1 className="mb-6 font-serif text-xl font-semibold uppercase tracking-wide">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="flex flex-col gap-8 lg:col-span-2">
          <section>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide">Contact</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="guestEmail">Email</Label>
                <Input
                  id="guestEmail"
                  type="email"
                  required
                  value={form.guestEmail}
                  onChange={(e) => update("guestEmail", e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" required value={form.phone} onChange={(e) => update("phone", e.target.value)} className="mt-1.5" />
              </div>
            </div>
            <p className="mt-2 text-xs text-charcoal-soft/60">We&apos;ll use these to send order updates and confirm delivery.</p>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide">Shipping Address</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" required value={form.fullName} onChange={(e) => update("fullName", e.target.value)} className="mt-1.5" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="line1">Address</Label>
                <Input id="line1" required value={form.line1} onChange={(e) => update("line1", e.target.value)} className="mt-1.5" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="line2">Apt, suite, etc. (optional)</Label>
                <Input id="line2" value={form.line2} onChange={(e) => update("line2", e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" required value={form.city} onChange={(e) => update("city", e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" required value={form.state} onChange={(e) => update("state", e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="postalCode">ZIP Code</Label>
                <Input id="postalCode" required value={form.postalCode} onChange={(e) => update("postalCode", e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input id="country" required value={form.country} onChange={(e) => update("country", e.target.value)} className="mt-1.5" />
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide">Delivery Method</h2>
            <div className="flex flex-col gap-2">
              {(["Standard", "Express"] as const).map((method) => (
                <label key={method} className="flex cursor-pointer items-center justify-between rounded-sm border border-line p-3 text-sm has-[:checked]:border-gold-dark">
                  <span className="flex items-center gap-2">
                    <input type="radio" name="shippingMethod" checked={form.shippingMethod === method} onChange={() => update("shippingMethod", method)} />
                    {method} ({method === "Standard" ? "5-7 business days" : "2-3 business days"})
                  </span>
                  <span>{method === "Standard" ? (subtotal >= 5000 ? "Free" : formatPrice(600)) : formatPrice(1200)}</span>
                </label>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide">Payment</h2>
            <div className="flex flex-col gap-2">
              <label className="flex cursor-pointer items-center gap-2 rounded-sm border border-line p-3 text-sm has-[:checked]:border-gold-dark">
                <input type="radio" name="paymentMethod" checked={form.paymentMethod === "COD"} onChange={() => update("paymentMethod", "COD")} />
                Cash on Delivery
              </label>
              <label className="flex cursor-not-allowed items-center gap-2 rounded-sm border border-line p-3 text-sm text-charcoal-soft/60">
                <input type="radio" name="paymentMethod" disabled />
                Card Payment (coming soon)
              </label>
            </div>
          </section>
        </div>

        <div className="h-fit rounded-sm border border-line bg-paper p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide">Order Summary</h2>
          <ul className="mb-4 flex flex-col gap-2 text-sm">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between text-charcoal-soft">
                <span className="line-clamp-1 pr-2">{item.productName} × {item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2 border-t border-line pt-3 text-sm">
            <div className="flex justify-between">
              <span className="text-charcoal-soft">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-soft">Shipping</span>
              <span>{shippingFee === 0 ? "Free" : formatPrice(shippingFee)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-line pt-2 text-base font-bold text-charcoal">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <Button type="submit" size="lg" loading={isSubmitting} disabled={isSubmitting} className="mt-5 w-full">
            {isSubmitting ? "Placing Order..." : "Place Order"}
          </Button>
        </div>
      </form>
    </div>
  );
}
