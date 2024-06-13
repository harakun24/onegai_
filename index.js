import morgan from "morgan";
// import helmet from "helmet";
import express from "express";
import cluster from "cluster";
import os from "os";
import path from "path";
import flash from "express-flash";
import { env, session_cache } from "./App/.config.js";
import collectorRoute from "./App/Routes/collector-routes.js";
import "./App/Routes/collector-routes.js"


// if (cluster.isPrimary) {
//     console.log("web server " + process.pid)
//     for (let i = 0; i < os.cpus().length; i++)
//         cluster.fork()
//     cluster.on("exit", (worker, code, signal) => {
//         console.log(`worker ${worker.process.pid} end`)
//     })
// }
// else {
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
        console.log(`\nserver ${process.pid} berjalan di port ${env.PORT || 8000}`)
    })
// }