import { motion } from "framer-motion";

const CallToActionSection = () => {
  return (
    <section className="bg-gradient-to-b from-[#111132] to-[#0c0c1d] py-16 text-white pl-4 pr-4">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="container mx-auto text-center"
      >
        <h2 className="text-[21px] lg:text-[42px] px-2 md:text-4xl font-bold pb-8 text-[#ffd32f]">
          Revolutionize Your Business with Our Next-Level POS Solutions
        </h2>
        <p className="text-sm px-2 md:text-lg mb-8">
          Discover the power of seamless transactions and streamlined operations
          with our intuitive POS solution. From quick and secure payments to
          robust inventory management, our POS system empowers businesses of all
          sizes to enhance efficiency, boost sales, and delight customers.
          Experience the future of retail with our innovative POS technology.
        </p>
        <a
          href="#"
          className="bg-[#ffd32f] text-sm md:text-[14px] text-black font-bold py-3 px-6 rounded-full inline-block transition duration-300"
        >
          Schedule a Demo
        </a>
      </motion.div>
    </section>
  );
};
export default CallToActionSection;
