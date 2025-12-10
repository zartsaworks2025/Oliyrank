import "../scss/main.scss"
import Hero from "../app/components/hero"

// app/page.tsx
export default function HomePage() {
  return (
    <div className="wrapper">
      {/* Keyin bu yerga hero, search va boshqa bloklarni qo‘shamiz */}
      <Hero />
    </div>
  );
}

