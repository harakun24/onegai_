import morgan from "morgan";
import helmet from "helmet";
import express from "express";
import path from "path";
import flash from "express-flash";
import { env, session_cache } from "./App/.config.js";
import collectorRoute from "./App/Routes/collector-routes.js";
import "./App/Routes/collector-routes.js"
const server = express();
console.log("\n---------------------------")

session_cache(server)
    .use(flash())
    // .use(helmet())
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    .use("/assets", express.static(path.join(import.meta.dirname, "public")))
    .use(morgan("tiny"))
    .use("/", collectorRoute)
    .listen(env.PORT || 8000, () => {
        console.log(`\nserver berjalan di port ${env.PORT || 8000}`)
    })