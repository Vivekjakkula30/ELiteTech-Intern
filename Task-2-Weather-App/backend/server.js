const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();

app.use(cors());


app.get("/weather/:city", async (req, res) => {
    try {
        const city = req.params.city;

        const weatherData = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}&units=metric`
        );

        res.json(weatherData.data);

    } catch (error) {
    console.log(error.response?.data || error.message);

    res.status(500).json({
        message: "City not found"
    });
}
    }
);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});