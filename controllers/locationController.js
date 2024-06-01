const fetch = require("node-fetch");

const getLocation = async (req, res) => {
  try {
    const response = await fetch("https://ipinfo.io/json");
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching geolocation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getLocation };
