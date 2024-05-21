import { FaPhone } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";
import { motion } from "framer-motion";

const FooterTop = () => {
  return (
    <footer className="bg-gradient-to-b from-[#0c0c1d] to-[#111132] max-h-max lg:h-[50vh] text-white lg:py-8 pl-4 pr-4">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="container mx-auto flex items-center justify-center"
      >
        <div className="grid grid-cols-1 px-2 pb-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="flex flex-col">
            <h2 className="text-[24px] font-bold text-[#ffd32f] mb-2">About</h2>
            <div className="bg-[#ffd32f] h-1 w-20 mb-2"></div>
            <div className="flex flex-col gap-2">
              <p className="text-[13px] hover:text-[#ffd32f]">
                DukaTrack Story
              </p>
              <p className="text-[13px] hover:text-[#ffd32f]">
                DukaTrack POs & data reports platform
              </p>
              <p className="text-[13px] hover:text-[#ffd32f]">Sustainability</p>
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-[24px] font-bold text-[#ffd32f] mb-2">
              Solutions
            </h2>
            <div className="bg-[#ffd32f] h-1 w-20 mb-2"></div>
            <div className="flex flex-col gap-2">
              <p className="text-[13px] hover:text-[#ffd32f]">
                DukaTrack Liqour POS
              </p>
              <p className="text-[13px] hover:text-[#ffd32f]">
                DukaTrack Beauty Shop POS
              </p>
              <p className="text-[13px] hover:text-[#ffd32f]">
                DukaTrack Pharmacy POS
              </p>
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-[24px] font-bold text-[#ffd32f] mb-2">
              Our People
            </h2>
            <div className="bg-[#ffd32f] h-1 w-20 mb-2"></div>
            <div className="flex flex-col gap-2">
              <p className="text-[13px] hover:text-[#ffd32f]">Who we are</p>
              <p className="text-[13px] hover:text-[#ffd32f]">
                Development at DukaTrack
              </p>
              <p className="text-[13px] hover:text-[#ffd32f]">Join our team</p>
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-[24px] font-bold text-[#ffd32f] mb-2">
              Contact us
            </h2>
            <div className="bg-[#ffd32f] h-1 w-20 mb-2"></div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <FaPhone className="text-[#ffd32f] h-[13px] w-[13px]" />
                <p className="text-[13px]">+254742548359</p>
              </div>
              <div className="flex items-center gap-2">
                <MdEmail className="text-[#ffd32f] h-[13px] w-[13px]" />
                <p className="text-[13px]">info@dukatract.co.ke</p>
              </div>
              <div className="flex items-center gap-2">
                <IoLocationSharp className="text-[#ffd32f] h-[13px] w-[13px]" />
                <div className="flex flex-col gap-2">
                  <p className="text-[13px]">EcoBank Towers, 2nd Floor</p>
                  <p className="text-[13px]">Muindi Mbingu St.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default FooterTop;
