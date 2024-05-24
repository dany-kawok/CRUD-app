const allowedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ status: "error", message: "Not authorized to do this!" });
    }
    next();
  };
};

module.exports = allowedTo;
