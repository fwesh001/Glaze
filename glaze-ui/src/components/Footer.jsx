export default function Footer() {
  const footerLinks = [
    { label: 'GitHub', href: 'https://github.com/fwesh001' },
    { label: 'Email', href: 'mailto:zabdielfwesh001@gmail.com' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/zabdiel-anyaogu-9b1a4a1b7/' },
    { label: 'Website', href: 'https://www.zabdiel.tech/' },
  ];

  return (
    <footer className="grid gap-4 border-t border-white/10 py-6 text-xs uppercase tracking-[0.35em] text-zinc-500 sm:grid-cols-2 lg:grid-cols-4">
      {footerLinks.map((item) => (
        <a key={item.label} href={item.href} target="_blank" rel="noreferrer" data-cursor-magnetic="true" className="transition-colors hover:text-white">
          {item.label}
        </a>
      ))}
    </footer>
  );
}
