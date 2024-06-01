const fetch = require("node-fetch");

const getLocation = async (req, res) => {
  try {
    // Extract user's IP address from the incoming request
    const ipAddress = req.ip; // Assuming req.ip contains the user's IP address

    // Use a third-party service to get location based on IP address
    const response = await fetch(`https://ipinfo.io/${ipAddress}/json`);
    const data = await response.json();

    // Return the location data to the client
    res.json(data);
  } catch (error) {
    console.error("Error fetching geolocation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getLocation };
