import { motion } from "framer-motion";
const TestimonialSection = () => {
  // Sample testimonial data
  const testimonials = [
    {
      id: 1,
      quote:
        "I absolutely love DukaTrack products. It's not just a POS company, it's an experience.",
      author: "Edwin Mwangi",
      videoUrl: "https://www.youtube.com/embed/your-video-id-1",
    },
    {
      id: 2,
      quote:
        "DukaTrack's innovation is unparalleled. I'm proud to be a DukaTrack client.",
      author: "Joan Maina",
      videoUrl: "https://www.youtube.com/embed/your-video-id-2",
    },
    {
      id: 3,
      quote:
        "DukaTrack commitment to sustainability is inspiring. Using the DukaTrack POS is improving my business.",
      author: "Harriet Muigai",
      videoUrl: "https://www.youtube.com/embed/your-video-id-3",
    },
  ];

  return (
    <section className="bg-white text-[#174993] py-16 pl-4 pr-4">
      {/* Container for testimonial content */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="container mx-auto px-4"
      >
        <h2 className="text-[21px] lg:text-[42px] font-bold mb-8 text-center">
          Testimonials
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2">
          {/* Map through testimonial data and render each testimonial */}
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white">
              <div className="aspect-w-full aspect-h-full">
                <iframe
                  className="w-full h-[250px]"
                  src={testimonial.videoUrl}
                  title={`Testimonial Video ${testimonial.id}`}
                  allowFullScreen
                ></iframe>
              </div>
              <p className="text-sm mt-4 mb-4 text-center text-[#174993]">
                {testimonial.quote}
              </p>
              <p className="text-[#174993] text-center font-nunito font-bold">
                {testimonial.author}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default TestimonialSection;
