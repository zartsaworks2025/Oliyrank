import "../scss/main.scss"
import Hero from "../app/components/hero"
import ExampleCards from "../app/components/exampleCards";

// app/page.tsx
export default function HomePage() {
  return (
    <div className="wrapper">
      {/* Keyin bu yerga hero, search va boshqa bloklarni qo‘shamiz */}
      <Hero />
      <ExampleCards />
      {/* more section later */}
    </div>
  );
}

