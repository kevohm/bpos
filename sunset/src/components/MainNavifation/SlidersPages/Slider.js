import React, { useEffect, useState } from 'react';
import './ImageSlider.scss';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { motion, useAnimation, useViewportScroll } from "framer-motion";


const ImageSlider = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showImageProfit, setShowImageProfit] = useState(false);
  const controlsTop = useAnimation();
  const controlsBottom = useAnimation(); 
  const controlsLeft = useAnimation();
  const controlsRight = useAnimation();
  const { scrollY } = useViewportScroll(); 

 

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };
 
  const handleReadMore = () => {
    alert(`Read more clicked for slide ${currentSlide + 1}`);
  };


  useEffect(() => {
    // Start the initial animation for the top part after the page loads
    controlsTop.start({ opacity: 1, y: 0 });

    // Define the trigger positions based on current scroll position
      const triggerBottom = 50; // Adjust as needed
      const triggerLeft = 100; // Adjust as needed
      const triggerRight = 200; // Adjust as needed

    // Function to handle animations based on scroll position
    const handleScroll = () => {
      const scrollPosition = scrollY.get();

      // Update animation controls based on scroll position
      if (scrollPosition > triggerBottom) {
        controlsBottom.start({ opacity: 1, y: 0 });
      }
      if (scrollPosition > triggerLeft) {
        controlsLeft.start({ opacity: 1, x: 0 });
      }
      if (scrollPosition > triggerRight) {
        controlsRight.start({ opacity: 1, x: 0 });
      }
    };

    // Attach the scroll event listener
    const unsubscribeScroll = scrollY.onChange(handleScroll);

    // Cleanup the event listener on component unmount
    return () => unsubscribeScroll();
  }, [controlsTop, controlsBottom, controlsLeft, controlsRight, scrollY]);


  useEffect(() => {
    const intervalId = setInterval(() => {
      nextSlide();
    }, 8000);

    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, [currentSlide]); // Trigger the effect whenever the current slide changes

  if (!slides || !slides.length) {
    return <div>No slides to display</div>;
  }




  return (
    <motion.div className="image-slider" 
      initial={{ opacity: 0, y: -100 }}
      animate={controlsTop}
      transition={{ duration: 1 }}
    >
      <motion.div className="slide" 
         initial={{opacity:0}}
         animate={{opacity:1}}
         transition={{delay:1.0, duration:1.0}}
      >
        <div className="nav-button-container">
            <div className='nav-button'>
                <div className='prev'>
                <motion.button 
                onClick={prevSlide}
                whileHover={{
                  scale:1.1
                }}
                >
                    <ArrowBackIosIcon />
                    </motion.button>
                </div>
            </div>
        </div>

        <div className="image-container">
          <img
            className="current-image"
            src={slides[currentSlide].image}
            alt={`Slide ${currentSlide}`}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.2 }} 
          />
          <img
            className="next-image"
            src={slides[(currentSlide + 1) % slides.length].image}
            alt={`Slide ${currentSlide}`}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.4 }}
          />
        </div>

        <motion.div className="slide-text"
          initial={{opacity:0}}
          whileInView={{opacity:1}}
          transition={{duration:1}}
        >
          <motion.h2>{slides[currentSlide].title}</motion.h2>

          <motion.p>{slides[currentSlide].description}</motion.p>

          <motion.button
            initial={{x:'-100vw'}}
            animate={{x:0}}
            transition={{type:'spring',stiffness:'300'}}
            whileHover={{
              scale:1.03,
            }}
          >
            <a href={slides[currentSlide].link}>Read More</a>
          </motion.button>
        </motion.div>

        <div className="nav-button-container">
            <div className='nav-button'>
                <div className='next'>
                    <motion.button 
                    onClick={nextSlide}
                    whileHover={{
                      scale:1.1
                    }}
                    >
                        <ArrowForwardIosIcon />
                    </motion.button>
                </div>
            </div>
        </div>


      </motion.div>
    </motion.div>
  );
};

export default ImageSlider;
