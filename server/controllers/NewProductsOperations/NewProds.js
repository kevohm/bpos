import { db } from "../../db.js";
import { pool } from "../../pool.js";


export const NewProducts = (req, res) => {
  const productQuery = `
    SELECT  np.id AS product_id, np.product_name,  np.category, np.Branch, np.Description, np.slug, np.branch_id,
    np.business_id, np.created_at,
    np.edited_at, im.imageOne
    FROM 
        NewProducts AS np 
    LEFT JOIN 
        Images AS im ON np.id = im.productId`;

  db.query(productQuery, (err, data) => {
    if (err) return res.status(500).json({ error: "Database error" });

    // Modify the data to include the image URLs for each product
    const productsWithImageUrls = data.map((product) => ({
      ...product,
      imageUrl: [`http://${req.hostname}/Images/${product.imageOne}`],
    })); 

    return res.status(200).json(productsWithImageUrls);
  });
};

export const getProductDetails = async (req, res) => {
  const { productId } = req.params;
  try {
    const productQuery = "SELECT * FROM NewProducts WHERE id = ?";
    const sizesQuery = "SELECT * FROM Sizes WHERE productId = ?";
    const imageQuery = "SELECT * FROM Images WHERE productId = ?";
    const branchQuery = "SELECT * FROM NewBranches WHERE id = ?";
    
    const [productResult] = await pool.query(productQuery, [productId]);
    if (productResult.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const product = productResult[0];

    const [sizesResult] = await pool.query(sizesQuery, [productId]);
    const sizes = sizesResult.length > 0 ? sizesResult : [];

    const [imagesResult] = await pool.query(imageQuery, [productId]);
    if (imagesResult.length === 0) {
      return res.status(404).json({ error: 'Images not found' });
    }
    const images = imagesResult[0];

    const [branchResult] = await pool.query(branchQuery, [product.branch_id]);
    if (branchResult.length === 0) {
      return res.status(404).json({ error: 'Branch not found' });
    }
    const branch = branchResult[0];

    const subSizesQuery = "SELECT * FROM SubSizes WHERE sizeId = ?";
    const subsizes = await Promise.all(
      sizes.map(async (size) => {
        const [result] = await pool.query(subSizesQuery, [size.id]);
        return result;
      })
    );

    const imageBaseUrl = `http://${req.hostname}/Images/`;
    const formattedImages = {
      ...images,
      imageOne: `${imageBaseUrl}${images.imageOne}`,
      imageTwo: `${imageBaseUrl}${images.imageTwo}`,
      imageThree: `${imageBaseUrl}${images.imageThree}`,
      imageFour: `${imageBaseUrl}${images.imageFour}`,
    };

    return res.status(200).json({ product, sizes, images: formattedImages, branch, subsizes });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Server Error" });
  }
};


export const getProductBySubsizeId = async (req, res) => {
  const { subsizeId } = req.params;
  try {
    const productQuery = "SELECT * FROM NewProducts WHERE id = ?";
    const sizeQuery = "SELECT * FROM Sizes WHERE id = ?";
    const subsizeQuery = "SELECT * FROM subsizes WHERE id = ?";
    const imageQuery = "SELECT * FROM Images WHERE productId = ?";
    const branchQuery = "SELECT * FROM NewBranches WHERE id = ?";

    const [[subsize]] = await pool.query(subsizeQuery, [subsizeId]);
    const [[size]] = await pool.query(sizeQuery, [subsize.sizeId]);

    const currentProduct = {subsize,size}
    return res
      .status(200)
      .json({ message:"Product found", product:currentProduct });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Server Error" });
  }
};




export const getCompanySchedules = (req, res) => {
  const business_id = req.params.business_id;
  const SelectQuery = `
              select * from company_schedules where business_id = ?
      `;
  db.query(SelectQuery, [business_id], (err, data) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error" });
    }

    res.json(data);
  });
};
