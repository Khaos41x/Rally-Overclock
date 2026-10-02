import "./globals.css";

export const metadata = {
  title: "Rally Overclock",
  description: "High-performance speed-reading and neuroplasticity training.",
};

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-ink text-neutral-200 font-sans antialiased">
        <link rel="stylesheet" href="/theme.css" />
        {children}
      </body>
    </html>
  );
}
