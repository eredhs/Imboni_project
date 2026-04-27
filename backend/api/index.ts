import express from "express";
import { createApp } from "../src/app.js";
import { connectDb, registerMongoReadyHandler } from "../src/config/db.js";
import { bootstrapMongoData } from "../src/services/bootstrap.service.js";

registerMongoReadyHandler(async () => {
  await bootstrapMongoData();
});

connectDb().catch(console.error);

const app = createApp();

module.exports = app;
