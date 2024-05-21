import mysql from "mysql2/promise";
import multer from "multer";
import { promises as fsPromises } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import slugify from "slugify";

const db = mysql.createConnection({
  host: "178.79.156.184",
  user: "Logic",
  password: "12Logic*",
  database: "liquorlogic", 
  multipleStatements: true,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const destinationDirectory = join(__dirname, "../public/Images");

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

export const AddNewProduct = (req, res) => {
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "fileTwo", maxCount: 1 },
    { name: "fileThree", maxCount: 1 },
    { name: "fileFour", maxCount: 1 },
  ])(req, res, async (err) => {
    if (err) {
      console.error("Error uploading images:", err);
      return res.status(400).json({ error: "File upload failed" });
    }

    try {
      const {
        product_name,
        category,
        Branch,
        Description,
        branch_id,
        business_id,
        sizes,
        subSizes,
      } = req.body;
      return res.json({body:req.body})
      const connection = await db;
      const slug = slugify(product_name, { lower: true });
      await connection.beginTransaction();

      const productInsertQuery = `INSERT INTO NewProducts (product_name, category, Branch, Description, slug, branch_id, business_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;

      const [productResult] = await connection.query(productInsertQuery, [
        product_name,
        category,
        Branch,
        Description,
        slug,
        branch_id,
        business_id,
      ]);
      const productId = productResult.insertId;

      const imageInsertQuery = `INSERT INTO Images (productId, imageOne, imageTwo, imageThree, imageFour) VALUES (?, ?, ?, ?, ?)`;
      const imageValues = [
        productId,
        req.files["file"] ? req.files["file"][0].filename : null,
        req.files["fileTwo"] ? req.files["fileTwo"][0].filename : null,
        req.files["fileThree"] ? req.files["fileThree"][0].filename : null,
        req.files["fileFour"] ? req.files["fileFour"][0].filename : null,
      ];
      await connection.query(imageInsertQuery, imageValues);

      console.log("SubSizes received:", subSizes);

      for (const size of sizes) {
        const sizeInsertQuery = `INSERT INTO Sizes (productId, sizeName, size, buyingPrice, sellingPrice, quantity) VALUES (?, ?, ?, ?, ?, ?)`;
        const [sizeResult] = await connection.query(sizeInsertQuery, [
          productId,
          size.sizeName,
          size.size,
          size.buyingPrice,
          size.sellingPrice,
          size.quantity,
        ]);

        const filteredSubSizes = subSizes.filter(
          (subSize) => parseInt(subSize.selectedSizeIndex) === sizes.indexOf(size)
        );        

        for (const subSize of filteredSubSizes) {
          const subSizeInsertQuery = `INSERT INTO SubSizes (sizeId, subSizeName, subSize, buyingPrice, sellingPrice, SubQuantity) VALUES (?, ?, ?, ?, ?, ?)`;
          await connection.query(subSizeInsertQuery, [
            sizeResult.insertId,
            subSize.subSizeName,
            subSize.subSize,
            subSize.buyingPrice,
            subSize.sellingPrice,
            subSize.SubQuantity,
          ]);
        }
      }

      await connection.commit();

      res
        .status(200)
        .json({ message: "Product added successfully", productId });
    } catch (error) {
      console.error("Error adding product:", error);
      res.status(500).json({ error: "Failed to add product" });
    }
  });
};

export const AddNewService = (req, res) => {
  upload.fields([
    { name: "file", maxCount: 1 }
  ])(req, res, async (err) => {
    if (err) {
      console.error("Error uploading images:", err);
      return res.status(400).json({ error: "File upload failed" });
    }

    try {
      const {
        service_name,
        category,
        Branch,
        Description,
        serviceSellingPrice,
        branch_id,
        business_id,
      } = req.body;

      const connection = await db;

      await connection.beginTransaction();
      const slug = slugify(service_name, { lower: true });
      const productInsertQuery = `INSERT INTO services (service_image, service_name, category, Branch, Description, slug, serviceSellingPrice, branch_id, business_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const [productResult] = await connection.query(productInsertQuery, [
        req.files["file"] ? req.files["file"][0].filename : null,
        service_name,
        category,
        Branch,
        Description,
        slug,
        serviceSellingPrice,
        branch_id,
        business_id,
      ]);

      await connection.commit();

      res
        .status(200)
        .json({ message: "Service added successfully", productId: productResult.insertId });
    } catch (error) {
      console.error("Error adding service:", error);
      await connection.rollback();
      res.status(500).json({ error: "Failed to add service" });
    }
  });
};


export const getProduct = async (req, res) => {
  // Using async to handle asynchronous database queries
  const productId = req.params.productId;

  const query = `
    SELECT 
        np.id AS product_id,
        np.product_name,
        np.category,
        np.Branch,
        np.Description,
        np.slug,
        np.created_at AS product_created_at,
        np.edited_at AS product_edited_at,
        s.id AS size_id,
        s.sizeName,
        s.size,
        s.buyingPrice AS size_buying_price,
        s.sellingPrice AS size_selling_price,
        s.quantity AS size_quantity,
        ss.id AS subsize_id,
        ss.subSizeName,
        ss.subSize,
        ss.buyingPrice AS subsize_buying_price,
        ss.sellingPrice AS subsize_selling_price,
        ss.SubQuantity AS subsize_quantity,
        i.id AS image_id,
        i.imageOne,
        i.imageTwo,
        i.imageThree,
        i.imageFour
    FROM 
        NewProducts np
    LEFT JOIN 
        Sizes s ON np.id = s.productId
    LEFT JOIN 
        SubSizes ss ON s.id = ss.sizeId
    LEFT JOIN 
        Images i ON np.id = i.productId
    WHERE 
        np.id = ?;
  `;

  try {
    const [rows] = await db.execute(query, [productId]);
    const productDetails = rows.map((row) => ({
      product_id: row.product_id,
      product_name: row.product_name,
      category: row.category,
      Branch: row.Branch,
      Description: row.Description,
      slug: row.slug,
      created_at: row.product_created_at,
      edited_at: row.product_edited_at,
      sizes: row.size_id
        ? [
            {
              size_id: row.size_id,
              sizeName: row.sizeName,
              size: row.size,
              buyingPrice: row.size_buying_price,
              sellingPrice: row.size_selling_price,
              quantity: row.size_quantity,
              subsizes: row.subsize_id
                ? [
                    {
                      subsize_id: row.subsize_id,
                      subSizeName: row.subSizeName,
                      subSize: row.subSize,
                      buyingPrice: row.subsize_buying_price,
                      sellingPrice: row.subsize_selling_price,
                      subsize_quantity: row.subsize_quantity,
                    },
                  ]
                : [],
            },
          ]
        : [],
      images: row.image_id
        ? [
            {
              image_id: row.image_id,
              imageOne: row.imageOne,
              imageTwo: row.imageTwo,
              imageThree: row.imageThree,
              imageFour: row.imageFour,
            },
          ]
        : [],
    }));

    res.json(productDetails);
  } catch (error) {
    console.error("Error executing MySQL query:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
