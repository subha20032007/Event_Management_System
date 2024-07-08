
  const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new Error('No token provided');
    }
    //console.log("auth",`${token}`, process.env.JWT_SECRET)
   const decode = jwt.verify(`${token}`, process.env.JWT_SECRET);
  //console.log(decode);
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({ message: 'Unauthorized' });
  }
};
module.exports = auth;
