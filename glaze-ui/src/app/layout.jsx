import './globals.css';
import '../library/toasts/liquid-toast/style.css';

export const metadata = {
  title: 'Glaze UI',
  description: 'Glaze UI scaffold',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
