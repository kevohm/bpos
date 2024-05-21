import CountUp from "react-countup";
import { motion } from "framer-motion";
const StatsSection = () => {
  const stats = [
    { id: 1, number: 67, name: "Shops served" },
    { id: 2, number: 679, name: "Users interacted" },
    { id: 3, number: 10000, name: "Clients served" },
  ];
  return (
    <section className="bg-gradient-to-b from-[#111132] to-[#0c0c1d]  text-[#174993] py-16 pl-4 pr-4">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="container mx-auto"
      >
        <div className="text-center mb-12 px-2">
          <h3 className="text-[21px] md:text-[42px] font-bold mb-4 text-white">
            DukaTrack in Numbers
          </h3>
          <p className="text-sm lg:text-lg text-white">
            Explore the impressive statistics behind our success.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto justify-center items-center">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className={`h-[150px] w-[150px] text-center lg:h-[294.8px] lg:w-[294.8px] flex flex-col items-center justify-evenly rounded-[50%] ${
                index === 1
                  ? "bg-[#fff] text-[#174993]"
                  : "bg-[#fff] text-[#174993]]"
              }`}
              style={{ margin: "auto" }} // Centering the circular divs
            >
              <h3 className="text-sm lg:text-2xl font-semibold mb-2">Over</h3>
              <p className="text-lg">
                <span className="text-[40px] lg:text-[60.2px] font-bold font-nunito">
                  <CountUp start={0} end={stat.number} duration={4} delay={0} />
                  +
                </span>
              </p>
              <p className="text-sm lg:text-[15px] text-center font-normal">
                {stat.name}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default StatsSection;
