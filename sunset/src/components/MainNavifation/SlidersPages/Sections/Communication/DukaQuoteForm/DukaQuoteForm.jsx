import React from "react";
import AnotherHeader from "../../../../NavigationAlpha/AlphaNavigation";
import "./quoteForm.scss";

const DukaQuoteForm = () => {
  return (
    <div className="overflow-hidden">
      <div className="flex justify-center items-center">
        <div className="w-full">
          <AnotherHeader />
        </div>
      </div>

      <div className="quoteForm">
        <div className="TextContainer">
          <h1>Boost Your Business Today!</h1>
          <p>
            Empower your business with our cutting-edge POS system. Streamline
            your sales, track your inventory effortlessly, and unlock new levels
            of efficiency. Let us customize a solution tailored to your unique
            needs. Get started now by requesting your personalized quote below:
          </p>
        </div>
        <div className="FormContainer">
          <div className="FormA">
            <div className="Entries">
              <label>Full name</label>
              <input placeholder="full name" name="name" />
            </div>
            <div className="Entries">
              <label>Business name</label>
              <input placeholder="Business name" name="business_name" />
            </div>
          </div>
          <div className="FormA">
            <div className="Entries">
              <label>Email</label>
              <input placeholder="doe@gmail.com" name="email" />
            </div>
            <div className="Entries">
              <label>Phone number</label>
              <input placeholder="+254..." name="mobile" />
            </div>
          </div>
          <div className="FormA">
            <div className="Entries">
              <label>County</label>
              <input placeholder="Nairobi.." name="county" />
            </div>
            <div className="Entries">
              <label>Sub County</label>
              <input placeholder="Kasarani" name="subcounty" />
            </div>
          </div>
          <div className="FormList">
            <p>Business Type</p>
            <div className="listings">
                <label>
                  <input type="checkbox" />
                  Liquor Business
                </label>
                <label>
                  <input type="checkbox" />
                  Beauty business
                </label>
                <label>
                  <input type="checkbox" />
                  Hardware Business
                </label>
            </div>
          </div>

          <div className="FormA">
            <div className="Entries">
              <label>Number of Shops / branches</label>
              <input placeholder="10.." name="branches" />
            </div>
            <div className="Entries">
              <label>No of Employees</label>
              <input placeholder="10.." name="staff" />
            </div>
          </div>
          
          <div className="FormTextArea">
            <label>Additional Information</label>
            <textarea placeholder="Additional Information" name="message" rows={5}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DukaQuoteForm;
