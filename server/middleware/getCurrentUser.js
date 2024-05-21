
const getCurrentUser = async (req, res, next) => {
try{
    console.log(req.headers["authorization"])
    return next();
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

export { getCurrentUser };
