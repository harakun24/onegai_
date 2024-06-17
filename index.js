
// import helmet from "helmet";
import { createClient } from "redis";
import RedisStore from "connect-redis";
import cluster from "cluster";
import express from "express";
import morgan from "morgan";
import flash from "express-flash";
import path from "path";
import os from "os";

import collectorRoute from "./App/Routes/collector-routes.js";
import { env, session_cache } from "./App/.config.js";
import "./App/Routes/collector-routes.js"

let client = createClient()
client.connect().catch(console.error)
const store = new RedisStore({
    client
})

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

session_cache(server, store)
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