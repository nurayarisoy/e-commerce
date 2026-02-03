import "./globals.css";
import Navbar from "../components/layout/Navbar";
import Toasts from "../components/ui/Toasts";

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        <Navbar />
        <Toasts />
        {children}
      </body>
    </html>
  );
}
