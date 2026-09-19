import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/server/services/product-service";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const limit = Number(searchParams.get("limit") ?? 10);

  const products = await searchProducts(q, limit);

  return NextResponse.json({
    products: products.map((p) => ({ id: p.id, name: p.name, slug: p.slug })),
  });
}
