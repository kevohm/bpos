import axios from "axios";

// Middlewares
const createToken = async (req, res, next) => {
  const secret = "HRhzddppeU4TY0XVeGjw0PF40Tq8Sm9yW0pErOXraG00PUPSVPjvnn0FlPg9XMEy";
  const consumer = "2GuFGShKJj0JZiyzFZIADGOZZhkdKTg1p27hDrhZa1VhG6sV";
  const auth = new Buffer.from(`${consumer}:${secret}`).toString("base64");
  try {
    const {data}= await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    console.log("Token Data: ",data);
    req.token = data?.access_token; 
    return next();
  } catch (error) {
    console.log(error); 
    return res.status(400).json(error);
  }
};
export {createToken}