import React from "react";
import ImagesSlide from "./SlidersPages/ImgesSlide";
import AnotherHeader from "./NavigationAlpha/AlphaNavigation";
import FeatureSection from "./SlidersPages/Sections/FeatureSection";
import ProductsSection from "./SlidersPages/Sections/ProductsSection";
import StatsSection from "./SlidersPages/Sections/StatsSection";
import PricingSection from "./SlidersPages/Sections/PricingSection";
import CallToActionSection from "./SlidersPages/Sections/CallToActionSection";
import TestimonialSection from "./SlidersPages/Sections/TestimonialSection";
import FooterTop from "./SlidersPages/Sections/FooterTop";
import FooterBottom from "./SlidersPages/Sections/FooterBottom";
import Communication from "./SlidersPages/Sections/Communication/Communication";



const MainBody = () => {




  return (
    <div className=" overflow-hidden">
      <div className="flex justify-center items-center">
        <div className="w-full">
          <AnotherHeader />
        </div>
      </div>

      <div className="flex justify-center items-center">
        <div className="w-full">
          <ImagesSlide />
        </div>
      </div>

      <div className="flex justify-center items-center">
        <div className="w-full">
          <FeatureSection />
        </div>
      </div>

      <div className="flex justify-center items-center">
        <div className="w-full">
          <ProductsSection />
        </div>
      </div>

      <div className="flex justify-center items-center">
        <div className="w-full">
          <StatsSection />
        </div>
      </div>

      <div className="flex justify-center items-center">
        <div className="w-full">
          <PricingSection />
        </div>
      </div>

      <div className="flex justify-center items-center">
        <div className="w-full">
          <CallToActionSection />
        </div>
      </div>

      <div className="flex justify-center items-center">
        <div className="w-full">
          <TestimonialSection />
        </div>
      </div>

      <div className=" flex justify-center items-center">
        <div className="w-full">
          <FooterTop />
          <FooterBottom />
        </div>
      </div>

      <div>
        <Communication />
      </div>

    </div>
  );
};

export default MainBody;
