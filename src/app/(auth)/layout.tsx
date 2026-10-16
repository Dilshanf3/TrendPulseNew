import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { getHeroContent } from "@/server/services/storefront-service";

/** Split-screen shell for sign in / sign up / password reset. */
export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const [image] = (await getHeroContent()).images;

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-6 py-6 sm:px-12">
        <div className="flex items-center justify-between">
          <Logo />
          <Link href="/" className="text-sm text-muted hover:text-foreground">
            ← Back to shop
          </Link>
        </div>
        <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">{children}</main>
      </div>
      <div className="relative hidden bg-surface-muted lg:block">
        {image && <Image src={image.url} alt="" fill priority sizes="50vw" className="object-cover" />}
      </div>
    </div>
  );
}
