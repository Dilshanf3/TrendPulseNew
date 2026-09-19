"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { cn, slugify } from "@/lib/utils";
import { Trash2 } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  isActive: boolean;
  _count: { products: number };
};

export function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const topLevel = categories.filter((c) => !c.parentId);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug: slugify(name), parentId: parentId || null, isActive: true, sortOrder: 0 }),
    });
    setIsSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error ?? "Could not create category");
      return;
    }
    toast.success("Category created");
    setName("");
    router.refresh();
  }

  async function handleToggle(id: string, isActive: boolean) {
    setPendingId(id);
    try {
      await fetch(`/api/admin/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      router.refresh();
    } finally {
      setPendingId(null);
    }
  }

  async function handleDelete(id: string) {
    setPendingId(id);
    try {
      await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-3 rounded-sm border border-admin-border bg-admin-surface p-4 shadow-sm">
        <div>
          <label className="text-xs font-semibold uppercase text-admin-text-muted">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-56 focus:border-admin-accent" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-admin-text-muted">Parent (optional)</label>
          <select value={parentId} onChange={(e) => setParentId(e.target.value)} className="mt-1 h-11 w-56 rounded-sm border border-admin-border bg-admin-surface px-3 text-sm text-admin-text focus:border-admin-accent">
            <option value="">None (top-level)</option>
            {topLevel.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <Button type="submit" loading={isSubmitting} disabled={isSubmitting} className="bg-admin-accent text-white hover:bg-admin-accent-hover">Add Category</Button>
      </form>

      <div className="rounded-sm border border-admin-border bg-admin-surface shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-admin-border text-left text-xs uppercase text-admin-text-muted">
              <th className="p-3">Name</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Products</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-admin-border">
                <td className="p-3">{cat.parentId ? <span className="pl-4 text-admin-text-muted">↳ {cat.name}</span> : <span className="font-semibold text-admin-text">{cat.name}</span>}</td>
                <td className="p-3 text-admin-text-muted">{cat.slug}</td>
                <td className="p-3 text-admin-text-muted">{cat._count.products}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleToggle(cat.id, cat.isActive)}
                    disabled={pendingId === cat.id}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase disabled:opacity-50",
                      cat.isActive ? "border border-emerald-300 text-emerald-700" : "border border-admin-border text-admin-text-muted"
                    )}
                  >
                    {pendingId === cat.id && <Spinner className="h-2.5 w-2.5" />}
                    {cat.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="p-3 text-right">
                  <button onClick={() => handleDelete(cat.id)} disabled={pendingId === cat.id} aria-label="Delete category" className="disabled:opacity-50">
                    {pendingId === cat.id ? (
                      <Spinner className="h-4 w-4 text-admin-text-muted" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-admin-text-muted hover:text-red-600" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
