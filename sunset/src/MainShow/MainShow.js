import React, { useState } from "react";
import ProductsShow from "./Products/ProductsShow";
import SalesPersonsNavigation from "./NavigationShow/SalesPersonsNavigation";
import ProductsView from "../SalesAgents/Products/ProductsView";

const MainShow = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState(0);

  return (
    <div>
      <SalesPersonsNavigation setSearchQuery={setSearchQuery} />
      <div>
        <div>
          <ProductsView
            searchQuery={searchQuery}
            minPrice={minPrice}
            setSearchQuery={setSearchQuery}
          />
        </div>
        <div>
          <ProductsShow
            searchQuery={searchQuery}
            minPrice={minPrice}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </div>
    </div>
  );
};

export default MainShow;
