import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../../AuthContext/AuthContext";

import "./Reciept.css"
import moment from 'moment';
export const SingleEntity = ({ id, quantity, price, name }) => {
  return (
    <>
      <tr>
        <td colSpan={4}>{name}</td>
      </tr>
      <tr>
        <td>{id}</td>
        <td>{quantity}</td>
        <td>{price}</td>
        <td>{`${price * quantity}`}</td>
      </tr>
    </>
  );
};

  

export const Reciept = ({ customerMobile, paymentMode, cashAmount, mpesaAmount, onCompletePayment  }) => {
  const { user } = useContext(AuthContext);
  const served_by = user?.fullname;
  const serving_branch = user?.Branch
  const company_name = user?.company_name
  const cart = useRef(JSON.parse(localStorage.getItem('cart')));
  // console.log(cart)
  const firstWordOfBusinessName = user?.company_name ? user.company_name.split(' ')[0] : '';
  const today = moment().format('MMMM D, YYYY'); 
  const printRef = useRef();

  useEffect(() => {
    if (onCompletePayment) {
      onCompletePayment(printRef.current);
    }
  }, [onCompletePayment]);

let totalAmount = 0;
  cart.current.forEach(item => {
    totalAmount += item.price * item.quantity;
  });
  return (
    <div  ref={printRef} className=" reciept" id="capture">
      <h5 style={{textTransform:"uppercase",fontWeight:'bold'}}>{company_name}</h5>
      <h5 style={{textTransform:"uppercase",fontWeight:'700'}}>{serving_branch} Outlet</h5>
 
      <h6>{today}</h6>
      <table className="mt-5 text-start uppercase reciept-table">
        <thead>
          <tr className="reciept-border-full">
            <td>
              <h5>ITEM</h5>
            </td>
            <td>
              <h5>QTY</h5>
            </td>
            <td>
              <h5>PRICE</h5>
            </td>
            <td>
              <h5>TOTAL</h5>
            </td>
          </tr>
        </thead> 
        <tbody>
        {
          cart.current.map((order) => <SingleEntity {...order} />)
        }


        </tbody>
        <tfoot>
          {/* first section  */}
          <tr className=" reciept-border">
            <td className="reciept-td" colSpan={3}>
              <h5>AMOUNT:</h5>
            </td>
            <td className="reciept-td" colSpan={1}>
              <h5>{totalAmount}</h5>
            </td>
          </tr>

          {/* section  */}
          <tr>
            <td colSpan={3}>
              <h6>vat (16.00%)</h6>
            </td>
            <td colSpan={1}>
              <h6>{(totalAmount * 0.16).toFixed(0)}</h6>
            </td>
          </tr>
          
          {/* section  */}
          <tr className="reciept-border">
            <td colSpan={4}>
              <h6 style={{fontSize:'15px'}}>Payment Mode: {paymentMode === 'both' ? 'M-Pesa & Cash' : paymentMode}</h6>
            </td>
          </tr>
          <tr >
            <td colSpan={4}>
              {paymentMode === 'cash' || paymentMode === 'both' ? (
                  <h6 style={{fontSize:'15px'}}>Cash Amount: {cashAmount}</h6>
              ) : null}
              {paymentMode === 'mpesa' || paymentMode === 'both' ? (
                  <h6 style={{fontSize:'15px'}}>M-Pesa Amount: {mpesaAmount}</h6>
              ) : null}
            </td>
          </tr>
          <tr>
            <td colSpan={4}>
              <h6 style={{fontSize:'15px'}}>Customer Mobile: {customerMobile}</h6>
            </td>
          </tr>
       
          {/* section  */}
          <tr className="reciept-border">
            <td colSpan={4}>
              <h6 style={{textAlign:'center',paddingTop:'5px',paddingBottom:'5px',fontSize:'13px'}}>Served by: <strong>{served_by}</strong></h6>
            </td>
          </tr>
          {/* section  */}
      
          <tr>
            <td colSpan={4} className="text-center">
              <h6 style={{textAlign:'center',paddingTop:'5px',paddingBottom:'5px',fontSize:'13px'}}>
                prices include vat inclusive where applicable
              </h6>
            </td>
          </tr>
          <tr>
            <td colSpan={4} style={{textAlign:'center',paddingTop:'5px',paddingBottom:'5px',fontSize:'13px'}}>
              <h5>Goods once sold are non refundable. Thank you!</h5>
            </td>
          </tr>
          <tr>
            <td colSpan={4} className="text-center pt-4 sm:pt-4 md:pt-4 lg:pt-4 xl:pt-4"><h6>{firstWordOfBusinessName}</h6></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};