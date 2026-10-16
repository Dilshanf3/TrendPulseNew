"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Lock, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { SummaryRows } from "@/components/cart/order-summary";
import { useCart } from "@/hooks/use-cart";
import { cn, formatPrice } from "@/lib/utils";
import { SHIPPING_METHODS, getShippingFee, type ShippingMethod } from "@/lib/pricing";

const FIELDS = {
  contact: [
    { id: "guestEmail", label: "Email", type: "email", autoComplete: "email" },
    { id: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  ],
  address: [
    { id: "fullName", label: "Full name", autoComplete: "name", wide: true },
    { id: "line1", label: "Address", autoComplete: "address-line1", wide: true },
    { id: "line2", label: "Apartment, suite, etc. (optional)", autoComplete: "address-line2", wide: true, optional: true },
    { id: "city", label: "City", autoComplete: "address-level2" },
    { id: "state", label: "Province", autoComplete: "address-level1" },
    { id: "postalCode", label: "Postal code", autoComplete: "postal-code" },
    { id: "country", label: "Country", autoComplete: "country-name" },
  ],
} as const;

type FieldId = (typeof FIELDS)["contact" | "address"][number]["id"];

const radioCard =
  "flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border bg-surface p-4 text-sm transition-colors has-[:checked]:border-foreground has-[:checked]:ring-1 has-[:checked]:ring-foreground";

function Section({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 flex items-center gap-3 text-base font-semibold">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-xs text-primary-foreground">{step}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, subtotal, status, load } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fields, setFields] = useState<Record<FieldId, string>>({
    guestEmail: "",
    phone: "",
    fullName: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Sri Lanka",
  });
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("Standard");

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const email = session?.user?.email;
    if (email) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- prefill contact email once session loads
      setFields((f) => (f.guestEmail ? f : { ...f, guestEmail: email }));
    }
  }, [session]);

  const shippingFee = getShippingFee(subtotal, shippingMethod);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, shippingMethod, paymentMethod: "COD" }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Could not place order");
        return;
      }
      await load();
      router.push(`/account/orders?success=${data.orderNumber}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (status !== "ready") {
    return (
      <div className="flex justify-center py-32">
        <Spinner className="h-6 w-6 text-muted" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-10">
        <EmptyState
          icon={ShoppingBag}
          title="Your bag is empty"
          description="Add a few pieces before checking out."
          action={{ label: "Start shopping", href: "/new-in" }}
        />
      </div>
    );
  }

  const renderField = (f: (typeof FIELDS)["contact" | "address"][number]) => (
    <div key={f.id} className={cn("wide" in f && f.wide && "sm:col-span-2")}>
      <Label htmlFor={f.id}>{f.label}</Label>
      <Input
        id={f.id}
        type={"type" in f ? f.type : "text"}
        autoComplete={f.autoComplete}
        required={!("optional" in f)}
        value={fields[f.id]}
        onChange={(e) => setFields((prev) => ({ ...prev, [f.id]: e.target.value }))}
        className="mt-2"
      />
    </div>
  );

  return (
    <div className="container-page py-10 sm:py-14">
      <h1 className="mb-10 font-display text-3xl sm:text-4xl">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid gap-12 lg:grid-cols-[1fr_24rem] lg:gap-16">
        <div className="flex flex-col gap-10">
          <Section step={1} title="Contact">
            <div className="grid gap-4 sm:grid-cols-2">{FIELDS.contact.map(renderField)}</div>
            <p className="mt-3 text-xs text-muted">We&apos;ll use these to send order updates and confirm delivery.</p>
          </Section>

          <Section step={2} title="Delivery address">
            <div className="grid gap-4 sm:grid-cols-2">{FIELDS.address.map(renderField)}</div>
          </Section>

          <Section step={3} title="Delivery method">
            <div className="flex flex-col gap-3">
              {(Object.keys(SHIPPING_METHODS) as ShippingMethod[]).map((method) => {
                const fee = getShippingFee(subtotal, method);
                return (
                  <label key={method} className={radioCard}>
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={shippingMethod === method}
                        onChange={() => setShippingMethod(method)}
                        className="h-4 w-4 accent-foreground"
                      />
                      <span>
                        <span className="block font-medium">{SHIPPING_METHODS[method].label}</span>
                        <span className="block text-muted">{SHIPPING_METHODS[method].eta}</span>
                      </span>
                    </span>
                    <span className="font-medium">{fee === 0 ? "Free" : formatPrice(fee)}</span>
                  </label>
                );
              })}
            </div>
          </Section>

          <Section step={4} title="Payment">
            <div className="flex flex-col gap-3">
              <label className={radioCard}>
                <span className="flex items-center gap-3">
                  <input type="radio" name="paymentMethod" defaultChecked className="h-4 w-4 accent-foreground" />
                  <span>
                    <span className="block font-medium">Cash on delivery</span>
                    <span className="block text-muted">Pay in cash when your order arrives</span>
                  </span>
                </span>
              </label>
              <label className={cn(radioCard, "cursor-not-allowed opacity-50")}>
                <span className="flex items-center gap-3">
                  <input type="radio" name="paymentMethod" disabled className="h-4 w-4" />
                  <span className="font-medium">Card payment</span>
                </span>
                <span className="text-xs text-muted">Coming soon</span>
              </label>
            </div>
          </Section>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-surface p-6 lg:sticky lg:top-24">
          <h2 className="mb-5 text-base font-semibold">Order summary</h2>
          <ul className="mb-6 flex flex-col gap-4">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 text-sm">
                <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md bg-surface-muted">
                  <Image src={item.image} alt="" fill sizes="48px" className="object-cover" />
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[10px] text-primary-foreground">
                    {item.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1">{item.productName}</p>
                  {(item.color || item.size) && <p className="text-xs text-muted">{[item.color, item.size].filter(Boolean).join(" · ")}</p>}
                </div>
                <span className="tabular-nums">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-border pt-5">
            <SummaryRows subtotal={subtotal} shippingFee={shippingFee} />
          </div>
          <Button type="submit" size="lg" loading={isSubmitting} className="mt-6 w-full">
            {isSubmitting ? "Placing order…" : "Place order"}
          </Button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
            <Lock className="h-3 w-3" /> Your details are sent securely
          </p>
        </aside>
      </form>
    </div>
  );
}
