import './globals.css';
import '../library/toasts/liquid-toast/style.css';
import { PageTransitionProvider } from '../components/PageTransitionProvider';

export const metadata = {
  title: 'Glaze UI',
  description: 'Glaze UI scaffold',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>
        <PageTransitionProvider>{children}</PageTransitionProvider>
      </body>
    </html>
  );
}
