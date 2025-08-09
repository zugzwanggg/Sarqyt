import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
// routes
import { authRouter } from "./routes/authRoute.js";
import { userRouter } from "./routes/userRoute.js";
import { shopRouter } from "./routes/shopRoute.js";
import { sarqytRoute } from "./routes/sarqytRoute.js";
import { initBot } from "./bot/telegramBot.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: `${process.env.FRONTEND_BASE_URL}`,
  credentials: true
}
app.use(cors(corsOptions));

app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', shopRouter);
app.use('/api', sarqytRoute);


initBot();

const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=>{
  console.log('Server is running');
});