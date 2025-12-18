import "../scss/main.scss"
import Hero from "../components/home/Hero";
import ExampleCards from "../components/home/ExampleCards";

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

