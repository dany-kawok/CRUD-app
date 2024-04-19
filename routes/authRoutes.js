const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
// When an access token expires, the client can use the refresh
//token to request a new access token from the authorization server
// without requiring the user to reauthenticate.
// Refresh tokens are used to maintain the user's session and provide
// a seamless user experience by preventing frequent reauthentication.
router.route("/register").post(authController.register);
router.route("/login").post(authController.login);
router.route("/refresh").get(authController.refreshToken);
router.route("/logout").get(authController.logout);
module.exports = router;
