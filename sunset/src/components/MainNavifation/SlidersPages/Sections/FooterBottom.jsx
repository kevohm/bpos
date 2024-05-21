import { motion } from "framer-motion";
const FooterBottom = () => {
  return (
    <footer className="bg-[#ffd32f] py-8 pl-4 pr-4" id="footer">
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.5 }}
        className="container mx-auto flex flex-col md:flex-row items-center justify-between"
      >
        <div className="mb-4 md:mb-0">
          <h1 className="text-[#0c0c1d] font-bold">DukaTrack</h1>
        </div>
        <div className="flex flex-wrap justify-center">
          <a href="#" className="text-[#0c0c1d] hover:text-white px-4 py-2">
            Home
          </a>
          <a href="#" className="text-[#0c0c1d] hover:text-white px-4 py-2">
            Products
          </a>
          <a href="#" className="text-[#0c0c1d] hover:text-white px-4 py-2">
            Features
          </a>
          <a href="#" className="text-[#0c0c1d] hover:text-white px-4 py-2">
            Pricing
          </a>
          <a href="#" className="text-[#0c0c1d] hover:text-white px-4 py-2">
            Support
          </a>
        </div>
        <div>
          <p className="text-[#0c0c1d]">
            &copy; {new Date().getFullYear()} DukaTrack, Inc. All rights
            reserved.
          </p>
        </div>
      </motion.div>
    </footer>
  );
};

export default FooterBottom;
