import './globals.css';
import '../library/toasts/liquid-toast/style.css';
import CustomCursor from '../components/CustomCursor';
import GlazeContextMenu from '../components/GlazeContextMenu';
import { PageTransitionProvider } from '../components/PageTransitionProvider';
import { GlazeAuthProvider } from '../components/auth/GlazeAuthProvider';

export const metadata = {
  title: 'Glaze UI',
  description: 'Glaze UI scaffold',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>
        <GlazeAuthProvider>
          <PageTransitionProvider>
            <CustomCursor />
            {children}
            <GlazeContextMenu />
          </PageTransitionProvider>
        </GlazeAuthProvider>
      </body>
    </html>
  );
}
