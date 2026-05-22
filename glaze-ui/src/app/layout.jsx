import './globals.css';

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
