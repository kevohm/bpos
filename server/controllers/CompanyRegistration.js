import mysql from "mysql2/promise";
import multer from "multer";
import { promises as fsPromises } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import slugify from "slugify";
import sendSMS from "../middleware/sendSMS.js";
import nodemailer from "nodemailer";

const db = mysql.createPool({
  host: "178.79.156.184",
  user: "Logic",
  password: "12Logic*",
  database: "liquorlogic", 
  multipleStatements: true,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const destinationDirectory = join(__dirname, "../public/companies");

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await fsPromises.mkdir(destinationDirectory, { recursive: true });
      cb(null, destinationDirectory);
    } catch (err) {
      console.error("Error creating destination directory:", err);
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const maxFileNameLength = 255;
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    let fileName = file.originalname.replace(/\.jpeg|\.jpg|\.gif|\.png$/, "");
    fileName = fileName.substring(0, maxFileNameLength - uniqueSuffix.length);
    cb(null, fileName + "-" + uniqueSuffix + ".jpg");
  },
});

const upload = multer({ storage });


export const AddNewUser = async (req, res) => {
  try {
    upload.single("file")(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res
          .status(400)
          .json({ success: false, error: "Error uploading file" });
      }
      try {
        const {
          fullname,
          Branch,
          business_id,
          branch_id,
          role,
          job_role,
          mobile,
          userName,
          county,
          sub_county,
          password,
        } = req.body;

       
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const slug = slugify(fullname, { lower: true });
        const status = "Active";
        const verified = false;
        const user_profile = req.file.filename;
        const [results] = await db.query(
          "INSERT INTO users (user_profile,fullname, Branch, business_id, branch_id, role, job_role, mobile, userName, county, sub_county, slug, password, status, verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)",
          [
            user_profile,
            fullname,
            Branch,
            business_id,
            branch_id,
            role,
            job_role,
            mobile,
            userName,
            county,
            sub_county,
            slug,
            hashedPassword,
            status,
            verified,
          ]
        );

        // Send SMS notification
        const smsResponse = await sendSMS(
          `Hello ${fullname}. Your account has been successfully created. Click the link on your email to verify your account. Please call us on 0742548359/0111356555 for any assistance. Duka Track Limited`,
          mobile,
          "ROBERMS_LTD",
          "info@alphanex.co.ke"
        );
        console.log("SMS response:", smsResponse);
        const jwtSecret = "duka2024";
        const verificationToken = jwt.sign({ userName }, jwtSecret, {
          expiresIn: "1d",
        });

        // Send verification email
        const transporter = nodemailer.createTransport({
          host: "sm1.cloudoon.com",
          port: 587,
          secure: false,
          auth: {
            user: "info@alphanex.co.ke",
            pass: "@alphanex2024#",
          },
        });
        const verificationLink = `https://liquourlogic.co.ke/verify?token=${verificationToken}`;
        const emailMessage = `
            Dear ${fullname},

            Please click the following link to verify your email address and activate your account:

            ${verificationLink}

            This link will expire in 24 hours.

            Best regards,
            Duka Track Limited for
            Aplha Nex Softwares Limited
            `;
        const mailOptions = {
          from: "info@alphanex.co.ke",
          to: userName,
          subject: "Account Verification",
          text: emailMessage,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({
          success: true,
          message: "User registered successfully. Verification email sent.",
          companyId: results.insertId,
        });
      } catch (error) {
        console.error("Error registering user:", error);
        res
          .status(500)
          .json({ success: false, message: "Failed to register user" });
      }
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(400).json({ success: false, error: "Error uploading file" });
  }
};

export const AddNewCompany = async (req, res) => {
  try {
    upload.single("file")(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res
          .status(400)
          .json({ success: false, error: "Error uploading file" });
      }
      try {
        const {
          businessName,
          userName,
          mobile_contact,
          address,
          business_type,
          service_type,
          pricing_type,
          shops_count,
          employees_count,
          password,
        } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate slug from company name
        const slug = slugify(businessName, { lower: true });

        // Default values
        const role = "Admin";
        const status = "inactive";
        const verified = false;

        // Get file name from multer
        const logo = req.file.filename;

        // Insert data into database
        const [results] = await db.query(
          "INSERT INTO Businesses (businessName, userName, mobile_contact, address, business_type, service_type, pricing_type, shops_count, employees_count, logo, slug, password, role, status, verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            businessName,
            userName,
            mobile_contact,
            address,
            business_type,
            service_type,
            pricing_type,
            shops_count,
            employees_count,
            logo,
            slug,
            hashedPassword,
            role,
            status,
            verified,
          ]
        );

        // Send SMS notification
        const smsResponse = await sendSMS(
          `${businessName}  has been successfully registered. Click the link on your email to verify your account. Please call us on 0742548359/0111356555 for any assistance`,
          mobile_contact,
          "ROBERMS_LTD",
          "info@alphanex.co.ke"
        );

        console.log("SMS response:", smsResponse);

        // Generate email verification token
        const jwtSecret = "duka2024";

        const verificationToken = jwt.sign({ userName }, jwtSecret, {
          expiresIn: "1d",
        });

        // Send verification email
        const transporter = nodemailer.createTransport({
          host: "sm1.cloudoon.com",
          port: 587,
          secure: false,
          auth: {
            user: "info@alphanex.co.ke",
            pass: "@alphanex2024#",
          },
        });
        const verificationLink = `https://liquourlogic.co.ke/verify?token=${verificationToken}`;

        // Email message with verification link
        const emailMessage = `
            Dear ${businessName},

            Thank you for registering with our platform. 
            Please click the following link to verify your email address and activate your account:

            ${verificationLink}

            This link will expire in 24 hours.

            Best regards,
            Aplha Nex Softwares Limited
            `;
        const mailOptions = {
          from: "info@alphanex.co.ke",
          to: userName,
          subject: "Account Verification",
          text: emailMessage,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
          success: true,
          message: "Company registered successfully. Verification email sent.",
          companyId: results.insertId,
        });
      } catch (error) {
        console.error("Error registering company:", error);
        res
          .status(500)
          .json({ success: false, message: "Failed to register company" });
      }
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(400).json({ success: false, error: "Error uploading file" });
  }
};

export const AddNewBranch = async (req, res) => {
  try {
    const {
      name,
      location,
      operations_description,
      business_id,
      payment_method,
      paybill_number,
      account_number,
      till_number,
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const Branch = name;
    const slug = slugify(name, { lower: true });

    // Insert branch details into NewBranches table
    const [newBranch] = await db.query(
      "INSERT INTO NewBranches (name, location, operations_description, business_id, slug) VALUES (?, ?, ?, ?, ?)",
      [name, location, operations_description, business_id, slug]
    );

    // Get the last inserted branch_id
    const branch_id = newBranch.insertId;

    // If payment method is "Both", insert two payment records (Cash and Mpesa)
    if (payment_method === "Both") {
      await db.query(
        "INSERT INTO PaymentMethods (payment_method, paybill_number, account_number, till_number, Branch, branch_id, slug) VALUES (?, ?, ?, ?, ?, ?, ?)",
        ["Cash", null, null, null, Branch, branch_id, slug]
      );

      await db.query(
        "INSERT INTO PaymentMethods (payment_method, paybill_number, account_number, till_number, Branch, branch_id, slug) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          "Mpesa",
          paybill_number,
          account_number,
          till_number,
          Branch,
          branch_id,
          slug,
        ]
      );
    } else {
      // Insert payment details into PaymentMethods table
      await db.query(
        "INSERT INTO PaymentMethods (payment_method, paybill_number, account_number, till_number,Branch, branch_id, slug) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          payment_method,
          paybill_number,
          account_number,
          till_number,
          Branch,
          branch_id,
          slug,
        ]
      );
    }

    res
      .status(200)
      .json({ message: "Branch and payment details added successfully" });
  } catch (error) {
    console.error("Error adding branch and payment details:", error);
    res
      .status(500)
      .json({ message: "Failed to add branch and payment details" });
  }
};


export const AddNewSchedule = async (req, res) => {
  try {
    const {
      employee_name,
      event_type,
      branch,
      date_time,
      to_date_time,
      comments,
      business_id,
      branch_id,
      mobile,
      userName,
      user_id,
    } = req.body;

    await db.query(
      "INSERT INTO company_schedules (employee_name, event_type, branch, date_time, to_date_time,comments,business_id,branch_id,mobile,userName,user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? ,? ,?)",
      [employee_name, event_type, branch, date_time, to_date_time, comments, business_id,branch_id,mobile,userName,user_id]
    );

      // Send SMS notification
      const smsResponse = await sendSMS(
        `Hello ${employee_name}. Your ${event_type} has been set between ${date_time} and ${to_date_time} in ${branch} outlet. Please call us on 0742548359/0111356555 for any assistance. Duka Track Limited`,
        mobile,
        "ROBERMS_LTD",
        "info@alphanex.co.ke"
      );
      console.log("SMS response:", smsResponse);

    res.status(200).json({ message: "Schedule added successfully" });
  } catch (error) {
    console.error("Error adding schedule.", error);
    res.status(500).json({ message: "Failed to add schedule details." });
  }
};
