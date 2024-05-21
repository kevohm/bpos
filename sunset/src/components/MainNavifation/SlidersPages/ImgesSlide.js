import React from "react";
import { motion } from "framer-motion";
import "./ImageSlider.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import ScrollImage from "./images/scroll.png";

import eleven from "./images/eleven.png";
import fourteen from "./images/fourteen.png";
import fifteen from "./images/15.png";
import beer from "./images/beer.png";
import vodka from "./images/vodka.png";

const textVariants = {
  initial: {
    x: -500,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 1,
      staggerChildren: 0.1,
    },
  },
  scrollButton: {
    opacity: 0,
    y: 10,
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
};

const sliderVariants = {
  initial: {
    x: 0,
  },
  animate: {
    x: "-100%",
    transition: {
      repeat: Infinity,
      repeatType: "mirror",
      duration: 20,
    },
  },
};

const items1 = ["pricing"];

const items2 = ["contact us"];

const items3 = ["footer"];

const ImagesSlide = () => {
  return (
    <div className="Hero">
      <div className="Wrapper">
        <motion.div
          className="TextContainer"
          variants={textVariants}
          initial="initial"
          animate="animate"
        >
          <motion.h2 variants={textVariants}>Duka Track</motion.h2>
          <motion.h1 variants={textVariants}>
            Its all about pouring profits, one sip at a time.
          </motion.h1>

          <motion.div variants={textVariants} className="buttons">
            {items1.map((item) => (
              <motion.a href={`#${item}`} key={item}>
                <motion.button
                  variants={textVariants}
                  style={{ cursor: "pointer", border: "1px solid #ffd32f" }}
                >
                  Our Pricings
                </motion.button>
              </motion.a>
            ))}

            {items2.map((item2) => (
              <motion.a href={`#${item2}`} key={item2}>
                <motion.button
                  variants={textVariants}
                  style={{
                    color: "black",
                    background: "#ffd32f",
                    cursor: "pointer",
                  }}
                >
                  <a href="/public/sign_up">Let's Go</a>
                
                </motion.button>
              </motion.a>
            ))}
          </motion.div>
          <div style={{ zIndex: 1 }}>
            {" "}
            {items3.map((items3) => (
              <motion.a href={`#${items3}`} key={items3}>
                <motion.img
                  variants={textVariants}
                  animate="scrollButton"
                  src={ScrollImage}
                  style={{ zIndex: 999 }}
                />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
      <motion.div
        className="slidingText"
        variants={sliderVariants}
        initial="initial"
        animate="animate"
      >
        Simple Affordable Secure
      </motion.div>

      <div className="ImageContainer">
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          speed={1200}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          navigation={false}
          modules={[Autoplay, Pagination, Navigation]}
          className="swiperSlides"
        >
          <SwiperSlide className="individualSlide">
            <img src={vodka} />
          </SwiperSlide>

          <SwiperSlide className="individualSlide">
            <img src={eleven} />
          </SwiperSlide>
          <SwiperSlide className="individualSlide">
            <img src={fourteen} />
          </SwiperSlide>
          <SwiperSlide className="individualSlide">
            <img src={fifteen} />
          </SwiperSlide>
          <SwiperSlide className="individualSlide">
            <img src={beer} />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default ImagesSlide;
