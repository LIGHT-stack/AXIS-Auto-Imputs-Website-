import { SiteShell } from "@/components/axis/site-shell";
import { Providers } from "@/components/providers";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Providers>
      <SiteShell>{children}</SiteShell>
    </Providers>
  );
}
