import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useParams } from 'react-router-dom';

const COLORS = ['#063992', '#ff9800','red']; // Blue for 'Available', Orange for 'Sold'

const BranchProducts = () => {
  const { Branch } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_ADDRESS + `api/analytics/branchproductstatus/${Branch}`)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching branch analytics:', error);
      });
  }, [Branch]);


  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="Percentage"
          nameKey="ProductStatus"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          labelLine={false}
          label={(entry) => `${entry.ProductStatus} ${entry.Percentage}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default BranchProducts;
