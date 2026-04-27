import { createApp } from "../src/app.js";
import { connectDb, registerMongoReadyHandler } from "../src/config/db.js";
import { bootstrapMongoData } from "../src/services/bootstrap.service.js";

registerMongoReadyHandler(async () => {
  await bootstrapMongoData();
});

connectDb().catch(console.error);

export default createApp();
