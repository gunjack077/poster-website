export const metadata = {
  title: "Free Poster Prompt Generator",
  description: "Daraz / WhatsApp / Facebook prompt generator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui" }}>{children}</body>
    </html>
  );
}
