const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const fs = require("fs");
const path = require("path");

app.use(cors());
app.use(express.json());

const dataPath = path.join(__dirname, "data", "services.json");

const getServices = () => {
  const data = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(data);
};

app.get("/services", (req, res) => {
  const services = getServices();
  res.send(services);
});

app.get("/services/:id", async (req, res) => {
  const services = getServices();
  const requested = services.find(
    (service) => service.serviceId == req.params.id,
    );

  res.send(requested);
});

app.get("/dashboard", (req, res) => {
  const services = getServices();

  const totalServices = services.length;

  const totalSlots = services.reduce(
    (sum, service) => sum + service.slotsAvailable,
    0
  );

  const averagePrice =
    services.reduce((sum, service) => sum + service.price, 0) /
    totalServices;

  const categories = {};
  services.forEach((service) => {
    categories[service.category] =
      (categories[service.category] || 0) + 1;
  });

  res.json({
    totalServices,
    totalSlots,
    averagePrice: Number(averagePrice.toFixed(2)),
    categories,
  });
});

app.get("/", (req, res) => {
  res.send("server is running fine");
});




app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
