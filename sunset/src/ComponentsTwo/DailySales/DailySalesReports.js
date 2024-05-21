import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Bar } from "react-chartjs-2";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import "./DailySales.scss";
import { AuthContext } from "../../AuthContext/AuthContext";
import AlphaSideBarNav from "../../components/MainNavifation/NavigationAlpha/AlphaSideBarNav/AlphaSideBarNav";
import AlphaNavBarAdmin from "../../components/MainNavifation/NavigationAlpha/AlphaNavBarAdmin/AlphaNavBarAdmin";
import DownloadIcon from "@mui/icons-material/Download";

const DailySalesReports = () => {
  const { user } = useContext(AuthContext);
  const company_id = user?.company_id || user?.id;
  const [DailySalesView, setDailySalesView] = useState([]);

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_API_ADDRESS +
          `/api/adminfunctions/daily_sales_report/${company_id}`
      )
      .then((response) => {
        setDailySalesView(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [company_id]);

  // Extract dates and net sales from the fetched data
  const salesData = DailySalesView.map((sale) => ({
    date: moment(sale.SaleDate).format("YYYY-MM-DD"),
    netSales: sale.net_sales,
  }));

  // Aggregate net sales by day
  const dailyNetSales = salesData.reduce((acc, sale) => {
    const date = sale.date;
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += sale.netSales;
    return acc;
  }, {});

  // Extract day and sales data for plotting the bar graph
  const chartData = {
    labels: Object.keys(dailyNetSales),
    datasets: [
      {
        label: "Net Sales",
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 1,
        data: Object.values(dailyNetSales),
      },
    ],
  };

  return (
    <div className="home">
      <div className="HomeDeco">
        {user && user.role === "Admin" && <AlphaSideBarNav />}
        <div className="homeContainer">
          {user && user.role === "Admin" && <AlphaNavBarAdmin />}
          <div className="DailySales">
            <div className="DailySalesHeader">
              <h2>Daily Sales View</h2>
              <div className="PANDLREPORTS">
                <button>
                  <span>
                    <DownloadIcon />
                  </span>
                  <small>P&L</small>
                </button>
                <button>
                  <span>
                    <DownloadIcon />
                  </span>
                  <small>Report</small>
                </button>
              </div>
            </div>
            <div className="Datatable">
              <DataGrid
                style={{ padding: "20px" }}
                rows={DailySalesView.map((product, index) => ({
                  ...product,
                  id: index + 1, // Generating a unique identifier using the index
                  indexId: index + 1,
                }))}
                columns={[
                  { field: "indexId", headerName: "id", width: 70 },
                  { field: "Branch", headerName: "Branch", width: 100 },
                  { field: "SoldBy", headerName: "Seller", width: 150 },
                  {
                    field: "CashTotal",
                    headerName: "Cash",
                    width: 120,
                    valueFormatter: (params) =>
                      params.value.toLocaleString("en-US"),
                  },
                  {
                    field: "MpesaTotal",
                    headerName: "Mpesa",
                    width: 120,
                    valueFormatter: (params) =>
                      params.value.toLocaleString("en-US"),
                  },
                  {
                    field: "total_sales",
                    headerName: "Total_sales",
                    width: 120,
                    valueFormatter: (params) =>
                      params.value.toLocaleString("en-US"),
                  },
                  {
                    field: "expense",
                    headerName: "Expenses",
                    width: 120,
                    valueFormatter: (params) =>
                      params.value.toLocaleString("en-US"),
                  },
                  {
                    field: "net_sales",
                    headerName: "Net_sales",
                    width: 120,
                    valueFormatter: (params) =>
                      params.value.toLocaleString("en-US"),
                  },
                  {
                    field: "CostOfGoodsSold",
                    headerName: "Cost_of_goods_sold",
                    width: 120,
                    valueFormatter: (params) =>
                      params.value.toLocaleString("en-US"),
                  },

                  {
                    field: "SaleDate",
                    headerName: "Action Date",
                    width: 150,
                    renderCell: (params) => {
                      const originalDate = moment(params.row.SaleDate);
                      const adjustedDate = originalDate.subtract(3, "hours");
                      const formattedDate = adjustedDate.format("DD.MM.YYYY");
                      return <span>{formattedDate}</span>;
                    },
                  },
                ]}
                pageSize={10}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
                }}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                  },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
                disableColumnFilter
                disableDensitySelector
                disableColumnSelector
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailySalesReports;
