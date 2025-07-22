import "./globals.css";

export const metadata = {
  title: 'Local Chatbot',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex h-screen w-screen text-white bg-zinc-900">
        {children}
      </body>
    </html>
  );
}
