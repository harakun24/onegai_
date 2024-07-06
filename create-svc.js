const name = process.argv[2]

import fs from 'fs';
import path from 'path';

try {
    fs.writeFileSync(path.join(import.meta.dirname, "App/Services/", name + "Service.js"),
        `
import base from "./baseService.js";

const { view } = base
class service extends base {
    constructor() {
        super("${name}")
    }
    main(req, res) {

    }
}

export default new service();
`
    )
    console.log(`service ${name} dibuat`);
} catch (error) {
    console.log(`error ${error}`);
}