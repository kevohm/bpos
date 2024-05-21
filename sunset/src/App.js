import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/Home/HomePage";
import Orders from "./pages/Orders/Orders";
import Staff from "./pages/Staff/Staff";
import Hr from "./pages/HR/Hr";
import Auth from "./pages/Authentication/Auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Main from "./pages/Main/Main";
import CategoryPage from "./components/Widgets/CategoryPage";
import CartPage from "./components/Widgets/CartPage";
import CashFlow from "./ComponentsTwo/CashFlowManager/CashFlow";
import Calculator from "./ComponentsTwo/CashFlowManager/Calculator";
import Customers from "./ComponentsTwo/Sales/Customers";
import Attendants from "./pages/Staff/Attendants";
import Messages from "./ComponentsTwo/Communications/Messages";
import EditProfile from "./ComponentsTwo/EditDetails/EditProfile";
import CashSummary from "./ComponentsTwo/CashFlowManager/CashSummary";
import Views from "./ComponentsTwo/CashFlowManager/Views";
import BranchAnalytics from "./components/BranchAnalyitcs/BranchAnalytics ";
import CartShow from "./MainShow/Cart/CartShow";
import PaymentPage from "./MainShow/Checkout/PaymentPage ";
import ThankYouPage from "./MainShow/Checkout/ThankYouPage ";
import ProductEdits from "./MainShow/ProductEdits/ProductEdits";
import ReportView from "./MainShow/Reports/ReportView";
import Expenses from "./MainShow/Expenses/Expenses";
import AllProducts from "./Administrator/AllProducts/AllProducts";
import ClientLogin from "./components/MainNavifation/AllPages/ClientLoginPage/ClientLogin";
import ClientSingUp from "./components/MainNavifation/AllPages/ClientLoginPage/ClientSingUp";
import AlphaBottomNavigation from "./components/MainNavifation/NavigationAlpha/AlphaBottomNavigation/AlphaBottomNavigation";
import { useContext } from "react";
import { AuthContext } from "./AuthContext/AuthContext";
import AdminProductEdit from "./MainShow/ProductEdits/AdminProductEdit";
import StockAddition from "./ComponentsTwo/StockManager/StockAddition";
import AdminAnalytics from "./Administrator/AnalyticsAdmin/AdminAnalytics";
import SystemNotifications from "./Administrator/SystemNotifications/SystemNotifications";
import StockTaking from "./MainShow/ProductEdits/StockTaking/StockTaking";
import TakeStock from "./MainShow/ProductEdits/StockTaking/TakeStock";
import ProfileSettings from "./Administrator/ProfileSettings/ProfileSettings";
import DailySalesReports from "./ComponentsTwo/DailySales/DailySalesReports";
import StockOrder from "./MainShow/StockOrder/StockOrder";
import ReportProfile from "./MainShow/Reports/ReportProfile";
import AdminUserOrder from "./MainShow/StockOrder/StockOrderView/AdminUserOrder";
import SingleOrderView from "./MainShow/StockOrder/StockOrderView/SingleOrderView";
import OrderEdit from "./MainShow/StockOrder/StockOrderView/Responses/OrderEdit";
import DukaQuoteForm from "./components/MainNavifation/SlidersPages/Sections/Communication/DukaQuoteForm/DukaQuoteForm";
import AddUser from "./pages/Staff/AddUser/AddUser";
import AddProducts from "./pages/AddProducts/AddProducts";
import Companies from "./components/CompanyRegistration/Companies";
import CalendarPage from "./pages/Staff/Schedules/CalendarPage";
import UpdateUser from "./pages/Staff/AddUser/UpdateUser/UpdateUser";
import Single from "./SalesAgents/Products/SingleProduct/Single";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <ToastContainer />
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/Auth" element={<Auth />} />
            <Route path="/public/client-login" element={<ClientLogin />} />
            <Route path="/public/client-signup" element={<ClientSingUp />} />
            <Route path="/public/duka-quote" element={<DukaQuoteForm />} />
            <Route>
              <Route path="/index" element={<HomePage />} />
            </Route>

            <Route path="/cart" element={<CartShow />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="/productedits" element={<ProductEdits />} />
            <Route path="/stock_take" element={<StockTaking />} />
            <Route path="/stock_order" element={<StockOrder />} />
            <Route path="/stockorders" element={<AdminUserOrder />} />
            <Route
              path="/order_view/:order_serial"
              element={<SingleOrderView />}
            />
            <Route path="/single_order/:order_id" element={<OrderEdit />} />
            <Route path="/product_history/:id" element={<AdminProductEdit />} />
            <Route path="/product/:id" element={<Single />} />
            <Route path="/product_count/:id" element={<TakeStock />} />
            <Route path="/user_profile/:id" element={<ReportProfile />} />
            <Route path="/report" element={<ReportView />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/humanresource" element={<Hr />} />
            <Route path="/analytics" element={<AdminAnalytics />} />
            <Route path="/public/sign_up" element={<Companies />} />
            <Route path="/stocksetup" element={<StockAddition />} />
            <Route path="/products/:category" element={<CategoryPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/cashflow" element={<CashFlow />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/sales" element={<AllProducts />} />
            <Route path="/daily_sales" element={<DailySalesReports />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/myattendants" element={<Attendants />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/editprofile" element={<EditProfile />} />
            <Route path="/cashflowsummary" element={<CashSummary />} />
            <Route path="/views/:id" element={<Views />} />
            <Route path="/analytics/:Branch" element={<BranchAnalytics />} />
            <Route path="/notifications" element={<SystemNotifications />} />
            <Route path="/profile" element={<ProfileSettings />} />
            <Route path="/add_user" element={<AddUser />} />
            <Route path="/user_update/:id" element={<UpdateUser />} />
            <Route path="/new_product" element={<AddProducts />} />
            <Route path="/schedules" element={<CalendarPage />} />
          </Routes>
        </Router>

        <div>{user && user.role === "Admin" && <AlphaBottomNavigation />}</div>
      </div>
    </>
  );
}

export default App;
