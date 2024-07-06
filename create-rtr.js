const name = process.argv[2]
const dest = process.argv[3] ? process.argv[3] : name

import fs from 'fs';
import path from 'path';

try {
    fs.writeFileSync(path.join(import.meta.dirname, "App/Routes/", name + "Route.js"),
        `
import base from "./baseRoute.js";
//import service from "../Services/service.js";
class router extends base {
    constructor() {
        super("${dest}");

        this.method = {
            get: [
                ["/", (req,res)=>res.send("new route /${dest}")],
                
            ]
        }
    }
}

export default new router();
`
    )
    fs.appendFileSync(path.join(import.meta.dirname, "App/Routes/bundle.routes.js"),
        `export * as ${name} from "./${name}Route.js";
`)
    console.log(`route ${name} dibuat`);
} catch (error) {
    console.log(`error ${error}`);
}