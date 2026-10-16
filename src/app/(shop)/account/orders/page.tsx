import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, Package } from "lucide-react";
import type { OrderStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { formatPrice } from "@/lib/utils";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/section-header";

export const metadata = { title: "My orders" };

const STATUS_VARIANT: Partial<Record<OrderStatus, BadgeProps["variant"]>> = {
  DELIVERED: "success",
  CANCELLED: "danger",
  REFUNDED: "danger",
  PENDING: "warning",
};

const titleCase = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

export default async function OrdersPage(props: PageProps<"/account/orders">) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account/orders");

  const { success } = await props.searchParams;
  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <Link href="/account" className="text-sm text-muted hover:text-foreground">
          ← My account
        </Link>
        <div className="mt-4">
          <PageHeader title="Orders" />
        </div>

        {typeof success === "string" && (
          <div role="status" className="mb-8 flex gap-3 rounded-2xl bg-emerald-50 p-5 text-emerald-900">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <div>
              <p className="font-medium">Thank you — your order is confirmed</p>
              <p className="mt-0.5 text-sm text-emerald-800">
                Order #{success} has been placed. We&apos;ll be in touch to confirm delivery.
              </p>
            </div>
          </div>
        )}

        {orders.length === 0 ? (
          <EmptyState icon={Package} title="No orders yet" description="When you place an order, it will appear here." action={{ label: "Start shopping", href: "/new-in" }} />
        ) : (
          <ul className="flex flex-col gap-3">
            {orders.map((order) => (
              <li key={order.id} className="rounded-2xl border border-border bg-surface p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">#{order.orderNumber}</span>
                  <Badge variant={STATUS_VARIANT[order.status] ?? "outline"}>{titleCase(order.status)}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted">
                  {new Date(order.createdAt).toLocaleDateString("en-LK", { day: "numeric", month: "short", year: "numeric" })} ·{" "}
                  {order.items.length} {order.items.length === 1 ? "item" : "items"} ·{" "}
                  {order.paymentMethod === "COD" ? "Cash on delivery" : "Card"}
                </p>
                <p className="mt-3 text-base font-semibold tabular-nums">{formatPrice(Number(order.total))}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
