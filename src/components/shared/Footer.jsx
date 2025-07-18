export default function Footer() {
  return (
    <footer className="bg-background text-text-secondary border-t border-input py-4">
      <div className="max-w-6xl mx-auto px-4 flex flex-col  items-center justify-between gap-2">
        <p className="text-sm text-text-hard-secondary">
          © {new Date().getFullYear()} AdventureCo. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
