import { motion } from "framer-motion";
const FeatureSection = () => {
  const featureData = [
    {
      id: 1,
      title: "Inventory management",
      desc: "Experience the cutting-edge inventory tracking that is revolutionizing the way we you handle your business",
    },
    {
      id: 2,
      title: "Sales tracking",
      desc: "Harness the power of sales monitoring and tracking with mystockist pos solutions.",
    },
    {
      id: 3,
      title: "Customization",
      desc: "Explore the possibilities of control with our customizable products to fit your needs.",
    },
  ];
  return (
    <section id="feature" className="bg-gradient-to-b from-[#111132] to-[#0c0c1d] flex items-center py-16 pl-4 pr-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="text-center"
        >
          <h2 className="text-[21px] px-2 lg:text-3xl font-bold text-white mb-6 drop-shadow-md">
            Revolutionize Your Business with Our Next-Level POS Solutions
          </h2>
          <p className="text-sm lg:text-lg px-2 text-gray-200 mb-8">
            Discover the power of seamless transactions and streamlined
            operations with our intuitive POS solution. From quick and secure
            payments to robust inventory management, our POS system empowers
            businesses of all sizes to enhance efficiency, boost sales, and
            delight customers. Experience the future of retail with our
            innovative POS technology.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 px-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureData.map((feature, index) => (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5 }}
              key={feature.id}
              className={`rounded-lg shadow-md p-6 ${
                index === 1
                  ? "bg-[#ffd32f] text-[#0c0c1d]"
                  : "bg-transparent text-white border border-white"
              }`}
            >
              <h3 className="text-sm lg:text-xl font-semibold text-center mb-4">
                {feature.title}
              </h3>
              <p className="text-sm lg:text-xl text-center">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
