export const metadata = {
  title: "Poster Maker",
  description: "Generate Daraz/WhatsApp/Facebook posters",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
