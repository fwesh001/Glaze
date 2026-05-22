export default function MainLayout({ sidebar, children }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 p-6">
        {sidebar}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
