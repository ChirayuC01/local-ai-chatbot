import "./globals.css";

export const metadata = {
  title: 'Local Chatbot',
  description: 'Modern AI Chat Interface',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex h-screen w-screen text-white bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 overflow-hidden">
        <div className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.02"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50`}></div>
        <div className="relative z-10 flex w-full h-full">
          {children}
        </div>
      </body>
    </html>
  );
}