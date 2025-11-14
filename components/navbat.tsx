import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-sky-500/80" />
          <span className="text-lg font-semibold tracking-tight">
            OliyRank
          </span>
        </Link>

        <div className="flex items-center gap-4 text-sm text-slate-300">
          <Link href="/universities" className="hover:text-white">
            Universities
          </Link>
          <Link href="/learning-centers" className="hover:text-white">
            Learning centers
          </Link>
          <Link href="/compare" className="hover:text-white">
            Compare
          </Link>
          <Link href="/about" className="hover:text-white">
            About
          </Link>
        </div>
      </nav>
    </header>
  );
}
