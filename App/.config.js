import "dotenv/config";
import { Eta } from "eta";
import path from "path";
import session from "express-session";


const env = process.env;
const view = new Eta({
    tags: ["#!", "!!"],
    views: path.join(import.meta.dirname, "Views"),
    // cache: true
})
const session_cache = (app, store) => {

    app.use(session({
        store,
        resave: false,
        saveUninitialized: true,
        secret: "osay",
        cookie: {
            maxAge: 1000 * 60 * 60 * 24
        }
    }))
    return app;

}

const logger = (dest, user) => {
    const status = (dest == ".in" ? "masuk" : "keluar")
    console.log({ status, token: user, time_stamp: new Date() })
}
export { env, view, session_cache, logger }