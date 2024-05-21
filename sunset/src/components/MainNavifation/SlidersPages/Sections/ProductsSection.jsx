import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ProductsSection = () => {
  const [showAllProducts, setShowAllProducts] = useState(false);

  const products = [
    {
      id: 1,
      title: "Smart Supermarket Solutions",
      description:
        "Transform your supermarket management with our cutting-edge technology. Manage inventory efficiently, analyze sales trends, and enhance customer satisfaction through personalized shopping experiences.",
      link: "#",
    },
    {
      id: 2,
      title: "Efficient Law Practice Management",
      description:
        "Revolutionize your law firm operations with our tailored management solution. From case management to document handling, our application ensures seamless workflow and client satisfaction.",
      link: "#",
    },
    {
      id: 3,
      title: "Integrated Property Management",
      description:
        "Optimize your property management tasks with our all-in-one solution. From tenant management to financial tracking, our application ensures smooth operations and increased property value.",
      link: "#",
    },
    {
      id: 4,
      title: "Dynamic Bar Management",
      description:
        "From inventory tracking to crafting signature cocktails, we empower vibrant, profitable bars.",
      link: "#",
    },
    {
      id: 5,
      title: "Innovative Pharmacy Management",
      description:
        "Optimize your pharmacy operations with our advanced management system. From medication tracking to customer management, our solution ensures accuracy, compliance, and excellent patient care.",
      link: "#",
    },
    {
      id: 6,
      title: "Next-Gen Hospital Management",
      description:
        "Empower your healthcare institution with our comprehensive management application. Streamline patient records, optimize scheduling, and enhance overall efficiency to provide top-notch medical care.",
      link: "#",
    },
  ];

  // Filter products based on visibility state
  const filteredProducts = showAllProducts ? products : products.slice(0, 4);

  return (
    <section id="products" className="bg-gradient-to-b from-[#0c0c1d] to-[#111132] py-16 pl-4 pr-4">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="container mx-auto"
      >
        <div className="text-center mb-12">
          <h2 className="text-[21px] lg:text-[42px] text-[#ffd32f] font-bold mb-4">
            Discover Our Range Of Products
          </h2>
          <p className="text-sm lg:text-lg text-white font-nunito font-normal">
            Explore the innovative products offered by MyStockist.
          </p>
        </div>
        <div
          className={`grid grid-cols-1 px-2 md:grid-cols-3 lg:grid-cols-4 gap-8`}
        >
          {/* Map through filtered products array to generate product cards */}
          {filteredProducts.map((product, index) => (
            <div
              key={index}
              className={`rounded-lg shadow-md p-6 ${
                index % 2 === 0
                  ? "bg-[#fff] text-[#174993]"
                  : "bg-[#ffd32f] text-[#174993]"
              }`}
            >
              <h3 className="text-xl text-center font-semibold mb-4">
                {product.title}
              </h3>
              <p className="text-center mb-2">{product.description}</p>
              <Link
                to={`/products/${product.id}`}
                className="text-blue-500 text-center hover:underline"
              >
                View {product.title}
              </Link>
            </div>
          ))}
        </div>
        {/* Render arrow down icon if there are more than 3 products */}
        {products.length > 3 && (
          <div className="flex justify-center mt-8">
            <button
              className="text-white font-bold hover:text-[#ffd32f]"
              onClick={() => setShowAllProducts(!showAllProducts)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default ProductsSection;
