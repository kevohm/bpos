import express from "express";
import {
  checkPaymentStatus,
  generateToken,
  getCallback,
  getStatus, 
  makePayment,
} from "../controllers/Mpesa.js";
import { createToken } from "../middleware/getToken.js";

// import { validateTransaction } from "../controller/validator";

const MpesaRouter = express.Router();

// router.post("/stkpush", createToken, postStk);
// router.post("/callback", callback);
// router.post("/validate", validateTransaction);
MpesaRouter.get("/status", getStatus);
MpesaRouter.get("/token", generateToken);
MpesaRouter.post("/stk", createToken, makePayment);
MpesaRouter.post("/callback", getCallback);
MpesaRouter.post("/payemnt/status", createToken, checkPaymentStatus);

export default MpesaRouter;
