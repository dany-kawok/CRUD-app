const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, ////////this is to make cors pass credentials by cookies or other methods
  optionSuccessStatus: 200, // this operation was success
};

module.exports = corsOptions;
