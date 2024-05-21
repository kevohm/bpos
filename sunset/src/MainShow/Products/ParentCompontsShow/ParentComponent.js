// ParentComponent.js

import React, { useState } from 'react';
import Category from '../../sideBar/Category/Category';
import ProductsShow from '../ProductsShow';


const ParentComponent = () => {
    const [selectedCategory, setSelectedCategory] = useState('');


 

  return (
    <div>
        <Category setSelectedCategory={setSelectedCategory} />
      <ProductsShow selectedCategory={selectedCategory} />
    </div>
  );
}

export default ParentComponent;
