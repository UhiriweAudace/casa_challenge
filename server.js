import path from "path";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";

import { AppConfig } from "./config/index.js";
const app = express();

//Connect to MongoDb database
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose
	.connect(AppConfig.MongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("MongoDB connection successful.."))
	.catch(() => console.log("failed to connect.."));

app.use(cors());

//Load Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Load the routes
import userRoutes from "./routes/usersRoutes.js";
app.use("/api/auth", userRoutes);

import ingredientsRoutes  from './routes/ingredientsRoutes.js';
app.use('/api/ingredients', ingredientsRoutes)

app.use("/images", express.static(path.join("images")));

// const appPath = path.join(__dirname, 'frontend', 'dist', 'the-hottest-reviews');
// app.use(express.static(appPath));
// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(appPath, 'index.html'))
// })

app.listen(AppConfig.AppPort, () => {
	console.log(`CasaSoft Api is running on port ${AppConfig.AppPort}`);
});
