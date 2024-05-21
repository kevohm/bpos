import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Category = ({ setSelectedCategory }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [categories, setCategories] = useState([]);

  const handleSelectChange = (event) => {
    const selectedCategory = event.target.value;
    setSelectedOption(selectedCategory);
  
    // Call the setSelectedCategory function to update the parent's state
 
  };
  


  useEffect(() => {
    axios.get(process.env.REACT_APP_API_ADDRESS + '/api/analytics/categories')
      .then((response) => {
        setCategories(response.data);
      });
  }, []);

  return (
    <div className="mb-4 relative"> {/* Add margin bottom and relative positioning */}
      <label htmlFor="dropdown" className="block text-sm font-medium text-gray-700">
        Category:
      </label>
    
      {categories.length > 0 && (
        <div className="relative inline-block w-full mt-1">
          <select
            id="dropdown"
            value={selectedOption}
            onChange={handleSelectChange}
            className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm transition duration-500" // Added transition duration
          >
            <option value="option1">Select...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.value}>{cat.cat_name}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

export default Category;
