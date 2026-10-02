import "./globals.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Toasts from "../components/ui/Toasts";

export const metadata = {
  title: "MyShop | Ausgewählte Produkte",
  description: "Entdecke sorgfältig ausgewählte Produkte bei MyShop.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>
        <Navbar />
        <Toasts />
        {children}
        <Footer />
      </body>
    </html>
  );
}
