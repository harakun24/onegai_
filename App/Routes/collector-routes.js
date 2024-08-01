import express from "express";
import * as bundle from "./bundle.routes.js";
import { view } from "../.config.js"
import "colors"

console.log("\n---------------------------")
const listRouter = [...Object.entries(bundle)].map(e => e[1].default);
const mainRouter = express.Router();
const subrouteList = []
const mapRouting = listRouter.map(route => {
    return routeMapping(route);
})
function routeMapping(route) {
    console.log("\n")
    const result = [route.path, express.Router()];
    if (route.path != "/" && route.path != "/anggota")
        result[1].use((req, res, next) => {
            if (req.session.user == null)
                return res.redirect("/panel_login")
            return next();
        })
    else if (route.path == "/anggota")
        result[1].use((req, res, next) => {
            if (req.session.visitor == null)
                return res.redirect("/panel_login")
            return next();
        })

    for (const m in route.method) {
        if (m == "sub") {
            for (const sub of route.method.sub) {
                subrouteList.push({
                    parent: route.path,
                    path: sub[0],
                    route: sub[1]
                })
            }
        }
        else
            for (const response of route.method[m]) {
                console.log(` ${"[ " + route.path.brightBlue + " ]" + " --".brightYellow + `${(m.toLocaleUpperCase() + "-----").substr(0, 4).brightYellow}` + "--| ".brightYellow + (response[0] == "/" ? "main".brightRed : response[0].substr(1, response[0].length - 1).brightCyan)}`)

                // if (response[1] instanceof Array)
                //     else
                result[1][m](...response)
                // result[1][m](response[0], response[1])
            }
    }
    return result;
};

for (const route of mapRouting) {
    mainRouter.use(route[0], route[1]);
}
for (const sub of subrouteList) {
    sub.route.path = (sub.parent == "/" ? "" : sub.parent) + sub.path;
    const route = routeMapping(sub.route)
    mainRouter.use(route[0], route[1])
}
mainRouter.use((req, res) => {
    res.send(view.render('/404.eta'))
})
export default mainRouter;