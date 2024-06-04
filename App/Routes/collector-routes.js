import express from "express";
import * as bundle from "./bundle.routes.js";


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
    if (route.path != "/")
        result[1].use((req, res, next) => {
            if (req.session.user == null)
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
                console.log(`  ${m.toLocaleUpperCase()}\t ${"[ " + route.path + " ]\t" + response[0]}`)
                result[1][m](response[0], response[1])
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
export default mainRouter;