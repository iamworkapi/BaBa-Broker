import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import multer from "multer";

const __dirname = dirname(fileURLToPath(import.meta.url));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = /\.(xlsx|xls|csv)$/i.test(file.originalname) || file.mimetype.includes('sheet') || file.mimetype.includes('excel') || file.mimetype === 'text/csv';
    cb(null, ok ? undefined : new Error('Only Excel/CSV files are allowed.'));
  },
});

// Load backend/.env explicitly so this server behaves the same regardless of
// the working directory it's spawned from (root `npm run dev` vs `cd backend`).
dotenv.config({ path: join(__dirname, "..", ".env") });

const { connectDB, dbState } = await import("./config/db.js");
const { default: Property } = await import("./models/Property.js");
const { default: User } = await import("./models/User.js");
const { default: apiRoutes } = await import("./routes/index.js");
const { errorHandler } = await import("./middleware/errorHandler.js");
const { default: bcrypt } = await import("bcryptjs");

const excelUploadRoutes = (await import("./routes/excelUploadRoutes.js")).default;

// backend/src/server.js -> backend/src -> backend -> project root (where dist/ lives)
const root = dirname(dirname(__dirname));
const distDirectory = join(root, "dist");
const port = process.env.PORT || 5000;

const initialProperty = {
  type: "flat",
  title: "1 BHK Fully Furnished Builder Floor near Metro",
  location: "Dwarka Mor, Delhi",
  price: "₹ 18,00,000",
  image: "",
  description:
    "Independent / Builder Floor | 1 BHK | Super Area: 400 sqft | Carpet Area: 380 sqft | 1 Bathroom | Fully Furnished | Ready to Move | Listed by Builder | West Facing | Bike Parking available (no car parking) | Maintenance: ₹0/month | Total Floors: 4 | Lift available | Loan available | Near metro.",
};

const app = express();

app.use(cors());
// MongoDB caps a single document at 16MB, and this app stores uploaded photos/video
// as base64 directly on the document, so the request limit must stay safely under that.
app.use(express.json({ limit: "15mb" }));

// API routes
app.use("/api", apiRoutes);
app.use("/api/admin/excel-upload", excelUploadRoutes);
app.use("/api/excel", excelUploadRoutes);

// Serve the built frontend (Vite build output in /dist)
if (existsSync(distDirectory)) {
  app.use(express.static(distDirectory));
  app.get("*", (req, res) => {
    const indexFile = join(distDirectory, "index.html");
    if (existsSync(indexFile)) return res.sendFile(indexFile);
    res
      .status(404)
      .json({ error: "Frontend build not found. Run npm run build first." });
  });
}

// Central error handler (must be registered last)
app.use(errorHandler);

const seedBootstrapAdmin = async () => {
  const email = (process.env.ADMIN_EMAIL || "admin@bababroker.com")
    .trim()
    .toLowerCase();
  if (await User.findOne({ email })) return;
  const password = process.env.ADMIN_PASSWORD || "Baba@123";
  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ name: "Admin", email, passwordHash, role: "admin" });
  console.log(`Bootstrap admin account created: ${email}`);
};

const seedBootstrapSalesman = async () => {
  const email = (process.env.SALESMAN_EMAIL || "salesman@bababroker.com")
    .trim()
    .toLowerCase();
  if (await User.findOne({ email })) return;
  const password = process.env.SALESMAN_PASSWORD || "Baba@123";
  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({
    name: "Salesman",
    email,
    passwordHash,
    role: "salesman",
  });
  console.log(`Bootstrap salesman account created: ${email}`);
};

const seedBootstrapEmployee = async () => {
  const email = (process.env.EMPLOYEE_EMAIL || "employee@bababroker.com")
    .trim()
    .toLowerCase();
  if (await User.findOne({ email })) return;
  const password = process.env.EMPLOYEE_PASSWORD || "Baba@123";
  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({
    name: "Employee",
    email,
    passwordHash,
    role: "employee",
  });
  console.log(`Bootstrap employee account created: ${email}`);
};

const start = async () => {
  await connectDB();
  if (dbState.ready) {
    if ((await Property.countDocuments()) === 0) {
      await Property.create(initialProperty);
    }
    await seedBootstrapAdmin();
    await seedBootstrapSalesman();
    await seedBootstrapEmployee();
  }
  app.listen(port, () =>
    console.log(`Baba Broker API running at http://localhost:${port}`),
  );
};

start();
