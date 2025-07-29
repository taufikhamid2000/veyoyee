import React from "react";
import Testimonial from "@/components/landing/Testimonial";

const testimonials = [
  {
    name: "Dr. Jane Smith",
    role: "Professor of Sociology",
    org: "University A",
    text: "Veyoyee is a game-changer for academic research. The data quality and ethical standards are unmatched.",
  },
  {
    name: "Alex Kim",
    role: "Market Research Lead",
    org: "Company C",
    text: "We finally found a platform that delivers real, actionable insights—not just empty survey responses.",
  },
  {
    name: "Maria Lopez",
    role: "Nonprofit Researcher",
    org: "Nonprofit B",
    text: "The transparent rewards and community focus make Veyoyee stand out. Our participants love it!",
  },
  {
    name: "Dr. Ravi Patel",
    role: "Research Director",
    org: "University D",
    text: "I was worried about AI-faked responses, but Veyoyee’s protections gave me total confidence in my data.",
  },
];

const TestimonialsSection = () => {
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    const timer = setInterval(
      () => setIdx((i) => (i + 1) % testimonials.length),
      4000
    );
    return () => clearInterval(timer);
  }, []);
  return (
    <section
      id="testimonials"
      className="w-full bg-gradient-to-b from-blue-950 to-indigo-950 py-[40px] md:py-[100px] px-4 md:px-6"
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center mb-6 md:mb-10">
          <span className="inline-block px-3 md:px-4 py-0.5 rounded-full bg-blue-900 text-blue-300 font-medium text-xs md:text-sm mb-4 md:mb-6">
            Testimonials
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-snug text-center">
            What Our Users Say
          </h2>
        </div>
        <div className="w-full flex flex-col items-center">
          <div className="relative w-full min-h-[170px] md:min-h-[220px] max-w-xs md:max-w-xl mx-auto flex items-center justify-center">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`absolute left-0 right-0 transition-opacity duration-700 flex justify-center ${
                  i === idx
                    ? "opacity-100 z-10 pointer-events-auto"
                    : "opacity-0 z-0 pointer-events-none"
                }`}
                style={{ display: i === idx ? "flex" : "none" }}
              >
                <Testimonial {...t} />
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-4 relative z-20">
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`w-2.5 h-2.5 rounded-full ${
                  i === idx ? "bg-blue-400" : "bg-gray-600"
                } transition`}
                onClick={() => setIdx(i)}
                aria-label={`Show testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
