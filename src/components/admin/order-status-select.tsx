"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

const STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleChange(newStatus: string) {
    setIsUpdating(true);
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setIsUpdating(false);
    if (!res.ok) {
      toast.error("Could not update order status");
      return;
    }
    toast.success("Order status updated");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        disabled={isUpdating}
        onChange={(e) => handleChange(e.target.value)}
        className="h-8 rounded-sm border border-admin-border bg-admin-surface px-2 text-xs font-semibold uppercase text-admin-text outline-none focus:border-admin-accent disabled:opacity-50"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      {isUpdating && <Spinner className="h-3.5 w-3.5 text-admin-text-muted" />}
    </div>
  );
}
