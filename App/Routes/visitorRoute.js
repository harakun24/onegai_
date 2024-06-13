
import base from "./baseRoute.js";
import service from "../Services/visitorService.js";
class router extends base {
    constructor() {
        super("visitor");

        this.method = {
            get: [
                ["/", (req, res) => res.send("new route /visitor")],

            ]
        }
    }
}

export default new router();
