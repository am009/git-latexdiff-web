import type { Metadata } from "next";
import AntdRegistry from '@ant-design/nextjs-registry/lib/AntdRegistry';

export const metadata: Metadata = {
  title: "Latexdiff-web",
  description: "A web interface for latexdiff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body><AntdRegistry>{children}</AntdRegistry></body>
    </html>
  );
}
