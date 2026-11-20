
const express = require("express");
require("dotenv").config();

const { connectDB } = require("./config/database");

const collectionRoutes = require("./routes/collectionRoutes");
const bookRoutes = require("./routes/bookRoutes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Assignment6 API is running"
    });
});

app.use("/collection", collectionRoutes);

app.use("/books", bookRoutes);

app.use("/logs", require("./routes/logRoutes"));

app.use((req, res) => {
    res.status(404).json({
        message: "Route Not Found"
    });
});

const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Server Error:", error.message);
    }
};

startServer();
