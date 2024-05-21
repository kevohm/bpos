import { motion } from "framer-motion";
const PricingSection = () => {
  return (
    <section
      id="pricing"
      className="bg-gradient-to-b from-[#0c0c1d] to-[#111132]  py-16 pl-4 pr-4"
    >
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-[21px] lg:text-[42px] font-poppins text-[#fff] font-bold mb-4">
            Our Pricing Range
          </h2>
          <p className="text-sm lg:text-lg text-[#fff]">
            Explore the pricing options for the DukaTrack products and services.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="grid grid-cols-1 px-2 md:grid-cols-3 gap-8"
        >
          <div className=" bg-white rounded-lg border border-[#174993] shadow-md p-6 flex flex-col items-center justify-center gap-4">
            <h3 className="text-xl font-semibold text-black mb-4">Standard</h3>
            <p className="text-gray-600 mb-2">Starting at Ksh.1,990</p>
            <p className="text-gray-600 mb-2">
              Accounts{" "}
              <span className="font-bold text-gray-700">1 User Account</span>
            </p>
            <p className="text-gray-600 mb-2">
              Reports <span className="font-bold text-gray-700">Limited</span>
            </p>
            <button className="bg-[#174993] text-white p-2 rounded hover:bg-[#0e3266]">
              View Details
            </button>
          </div>
          <div className=" bg-white rounded-lg shadow-md border border-[#174993] p-6 flex flex-col items-center justify-center  gap-4">
            <h3 className="text-xl font-semibold text-black mb-4">Economy</h3>
            <p className="text-gray-600 mb-2">Starting at Ksh. 3,990</p>
            <p className="text-gray-600 mb-2">
              Accounts{" "}
              <span className="font-bold text-gray-700">5 User Accounts</span>
            </p>
            <p className="text-gray-600 mb-2">
              Reports <span className="font-bold text-gray-700">Unlimited</span>
            </p>
            <button className="bg-[#174993] text-white p-2 rounded hover:bg-[#0e3266]">
              View Details
            </button>
          </div>
          <div className=" bg-white rounded-lg shadow-md border border-[#174993] p-6 flex flex-col items-center justify-center  gap-4">
            <h3 className="text-xl font-semibold text-black mb-4">Premium</h3>
            <p className="text-gray-600 mb-2">Starting at Ksh. 5,990</p>
            <p className="text-gray-600 mb-2">
              Accounts{" "}
              <span className="font-bold text-gray-700">
                Unlimited Accounts
              </span>
            </p>
            <p className="text-gray-600 mb-2">
              Reports <span className="font-bold text-gray-700">Unlimited</span>
            </p>
            <button className="bg-[#174993] text-white p-2 rounded hover:bg-[#0e3266]">
              View Details
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
