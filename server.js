const { swaggerUi, swaggerDocs } = require("./utils/swagger");
const express = require("express");
const cors = require("cors");
const path = require("path");
const authRouter = require("./routes/authRouter");
const carRouter = require("./routes/carRouter");
const adsRouter = require("./routes/adsRouter");
const reviewsRouter = require("./routes/reviewsRouter");

const app = express();
const port = 3300;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/uploads/uploads",
  express.static(path.join(__dirname, "uploads/uploads"))
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/auth", authRouter);
app.use("/cars", carRouter);
app.use("/ads", adsRouter);
app.use("/reviews", reviewsRouter);
app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});