"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";

type Category = { id: string; name: string };

export function ProductForm({
  categories,
  initialData,
  productId,
}: {
  categories: Category[];
  initialData?: {
    name: string;
    slug: string;
    description: string;
    basePrice: number;
    salePrice: number | null;
    categoryId: string;
    status: string;
    isNew: boolean;
    isFeatured: boolean;
  };
  productId?: string;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    slug: initialData?.slug ?? "",
    description: initialData?.description ?? "",
    basePrice: initialData?.basePrice ?? 0,
    salePrice: initialData?.salePrice ?? undefined,
    categoryId: initialData?.categoryId ?? categories[0]?.id ?? "",
    status: initialData?.status ?? "PUBLISHED",
    isNew: initialData?.isNew ?? false,
    isFeatured: initialData?.isFeatured ?? false,
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = productId ? form : { ...form, images: [], variants: [], tagIds: [] };
    const url = productId ? `/api/admin/products/${productId}` : "/api/admin/products";
    const method = productId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setIsSubmitting(false);

    if (!res.ok) {
      toast.error(data.error ?? "Could not save product");
      return;
    }

    toast.success(productId ? "Product updated" : "Product created");
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          required
          value={form.name}
          onChange={(e) => {
            update("name", e.target.value);
            if (!productId) update("slug", slugify(e.target.value));
          }}
          className="mt-1.5 focus:border-admin-accent"
        />
      </div>

      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" required value={form.slug} onChange={(e) => update("slug", e.target.value)} className="mt-1.5 focus:border-admin-accent" />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          required
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className="mt-1.5 h-24 w-full rounded-sm border border-admin-border bg-admin-surface p-3 text-sm text-admin-text outline-none focus:border-admin-accent"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="basePrice">Base Price</Label>
          <Input id="basePrice" type="number" step="0.01" required value={form.basePrice} onChange={(e) => update("basePrice", parseFloat(e.target.value))} className="mt-1.5 focus:border-admin-accent" />
        </div>
        <div>
          <Label htmlFor="salePrice">Sale Price (optional)</Label>
          <Input id="salePrice" type="number" step="0.01" value={form.salePrice ?? ""} onChange={(e) => update("salePrice", e.target.value ? parseFloat(e.target.value) : undefined)} className="mt-1.5 focus:border-admin-accent" />
        </div>
      </div>

      <div>
        <Label htmlFor="categoryId">Category</Label>
        <select
          id="categoryId"
          value={form.categoryId}
          onChange={(e) => update("categoryId", e.target.value)}
          className="mt-1.5 h-11 w-full rounded-sm border border-admin-border bg-admin-surface px-3 text-sm text-admin-text outline-none focus:border-admin-accent"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          value={form.status}
          onChange={(e) => update("status", e.target.value)}
          className="mt-1.5 h-11 w-full rounded-sm border border-admin-border bg-admin-surface px-3 text-sm text-admin-text outline-none focus:border-admin-accent"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-admin-text">
          <input type="checkbox" checked={form.isNew} onChange={(e) => update("isNew", e.target.checked)} />
          New Arrival
        </label>
        <label className="flex items-center gap-2 text-sm text-admin-text">
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => update("isFeatured", e.target.checked)} />
          Featured
        </label>
      </div>

      <Button type="submit" loading={isSubmitting} disabled={isSubmitting} className="mt-2 w-fit bg-admin-accent text-white hover:bg-admin-accent-hover">
        {isSubmitting ? "Saving..." : productId ? "Update Product" : "Create Product"}
      </Button>
    </form>
  );
}
