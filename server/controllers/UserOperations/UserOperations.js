import { db } from "../../db.js";
import mysql2 from "mysql2/promise";
import bcrypt from "bcryptjs";
import multer from "multer";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import fsPromises from "fs/promises";

const pool = mysql2.createPool({
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

// updating user details

export const updateUser = async (req, res) => {
  try {
    // Handle file upload
    upload.single("file")(req, res, async (err) => {
      if (err) {
        console.error("Error uploading file:", err);
        return res
          .status(400)
          .json({ success: false, error: "Error uploading file" });
      }
      try {
        // Extract user data from request body
        const user_id = req.params.user_id;
        const {
          fullname,
          role,
          job_role,
          mobile,
          county,
          sub_county,
          userName,
          Branch,
          password,
        } = req.body;

        // Check if a new image was uploaded
        let user_profile = "";
        if (req.file) {
          user_profile = req.file.filename;
        }

        // Hash password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        // Update user details in the database
        const sqlUpdate =
          "UPDATE users SET user_profile = ?, fullname = ?, role = ?, job_role = ?, mobile = ?, userName = ?, county = ?, sub_county = ?, Branch = ?, password = ? WHERE id = ?";
        const result = await pool.query(sqlUpdate, [
          user_profile,
          fullname,
          role,
          job_role,
          mobile,
          userName,
          county,
          sub_county,
          Branch,
          hash,
          user_id,
        ]);

        res.status(200).json({
          success: true,
          message: "User updated successfully",
          result,
        });
      } catch (error) {
        console.error("Error updating user:", error);
        res
          .status(500)
          .json({ success: false, message: "Failed to update user" });
      }
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(400).json({ success: false, error: "Error uploading file" });
  }
};

// All company users
export const getAllUsers = (req, res) => {
  const business_id = req.params.business_id;
  const SelectQuery = `
                select * from users where business_id = ?
        `;
  db.query(SelectQuery, [business_id], (err, data) => {
    if (err) return res.status(500).json({ error: "Database error" });
    const UsersWithImages = data.map((users) => ({
      ...users,
      imageUrl: [`http://${req.hostname}/companies/${users.user_profile}`],
    }));

    return res.status(200).json(UsersWithImages);
  });
};

// Current Branch user
export const getBranchUser = (req, res) => {
  const branch_id = req.params.branch_id;
  const SelectQuery = `
                  select * from users where branch_id = ?
          `;
  db.query(SelectQuery, [branch_id], (err, data) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error" });
    }
    res.json(data);
  });
};

//   getting individual users
export const getIndividualUser = (req, res) => {
  const user_id = req.params.user_id;
  const SelectQuery = `
  SELECT * FROM users where id = ?
        `;
  db.query(SelectQuery, [user_id], (err, data) => {
    if (err) return res.status(500).json({ error: "Database error" });
    const UsersWithImages = data.map((users) => ({
      ...users,
      imageUrl: [`http://${req.hostname}/companies/${users.user_profile}`],
    }));

    return res.status(200).json(UsersWithImages);
  });
};
