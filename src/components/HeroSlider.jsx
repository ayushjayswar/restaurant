
import { useEffect, useState } from "react";

const slides = [
  {
    image: "/images/slider1.jpg",
    title: "Welcome to Fork&Flame",
    subtitle: "An unforgettable dining experience",
  },
  {
    image: "/images/slider2.jpg",
    title: "Taste Something Special",
    subtitle: "Discover flavours made with passion",
  },
  {
    image: "/images/slider3.jpg",
    title: "Where Taste Meets Elegance",
    subtitle: "Every meal tells a story",
  },
  {
    image: "/images/slider4.jpg",
    title: "Moments Worth Sharing",
    subtitle: "Enjoy great food and beautiful moments",
  },
  {
    image: "/images/slider5.jpg",
    title: "Your Table Awaits",
    subtitle: "Make your next visit memorable",
  },
];

export default function HeroSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[420px] w-full overflow-hidden bg-stone-950 md:h-[480px]">
      {slides.map((slide, index) => (
        <div
          key={slide.image}
          aria-hidden={active !== index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            active === index
              ? "z-10 opacity-100"
              : "pointer-events-none z-0 opacity-0"
          }`}
          style={{ backgroundImage: `url("${slide.image}")` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/10" />

          <div className="absolute inset-0 flex items-center px-6 sm:px-12 md:px-20">
            <div className="max-w-3xl text-white">
              <h1 className="mb-4 text-3xl font-bold leading-tight sm:text-5xl md:text-6xl">
                {slide.title}
              </h1>

              <p className="text-base text-white/90 sm:text-xl">
                {slide.subtitle}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Five dots at bottom center */}
      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
        {slides.map((slide, index) => (
          <button
            key={slide.image}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Show slide ${index + 1}`}
            aria-current={active === index ? "true" : undefined}
            className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ${
              active === index
                ? "w-7 bg-orange-500"
                : "w-2.5 bg-white/70 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
