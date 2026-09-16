"use strict";
import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import { adminRouter } from './admin/routes';

import { connectToDatabase, disconnectFromDatabase } from './database/prisma';
import { configureRoutes } from './routes';
import { authMiddleWare } from './middleware/authMiddleware';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use('/admin-api', adminRouter);

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());

app.use(cors({
  origin: '*',
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  exposedHeaders: ["X-CSRF-Token", 'date', 'content-type', 'content-length', 'connection', 'server', 'x-powered-by', 'access-control-allow-origin', 'authorization', 'x-final-url'],
  preflightContinue: false,
  credentials: true,
  optionsSuccessStatus: 204
}));

// Connect to MySQL — fail fast if the database is unreachable.
connectToDatabase().catch((error) => {
  console.error(error);
  process.exit(1);
});

app.use(authMiddleWare);

// Configure routes
configureRoutes(app);

process.setMaxListeners(0);

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// Close the database pool on shutdown so connections are not left dangling.
const shutdown = async (signal: string) => {
  console.log(`${signal} received, shutting down...`);
  server.close(async () => {
    await disconnectFromDatabase();
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
