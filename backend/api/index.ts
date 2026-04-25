import { createApp } from "../src/app.js";
import { connectDb } from "../src/config/db.js";

connectDb().catch(console.error);

const app = createApp();

export default app;
