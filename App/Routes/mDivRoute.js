
import base from "./baseRoute.js";
//import service from "../Services/service.js";
class router extends base {
    constructor() {
        super("mDiv");

        this.method = {
            get: [
                ["/", (req,res)=>res.send("new route /mDiv")],
                
            ]
        }
    }
}

export default new router();
