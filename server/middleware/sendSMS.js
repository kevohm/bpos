import axios from "axios";

const sendSMS = async (message, phoneNumbers, senderName, uniqueIdentifier) => {
  try {
    const url = "https://roberms.co.ke/sms/v1/roberms/send/simple/sms";
    const body = {
        message,
      phone_number: phoneNumbers,
      sender_name: senderName,
      unique_identifier: uniqueIdentifier
    };
    const headers = {
      Authorization: "Token 51f27d8df2a79247b54d9f804d8206151acfdaab"
    };

    const response = await axios.post(url, body, { headers });
    
    return response.data; 
  } catch (error) {
    console.error("Error sending SMS:", error);
    throw new Error("Failed to send SMS");
  }
};

export default sendSMS;
