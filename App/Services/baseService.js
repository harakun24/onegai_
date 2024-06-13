import { view, logger } from "../.config.js"
import { PrismaClient } from "@prisma/client";
import "colors";

export default class {
    static view = view
    static db = new PrismaClient();
    constructor(name) {
        console.log(`    -- Service `.green + `${name}`.cyan)
    }
    keluar(req, res) {
        try {
            const { token } = req.session.user
            logger(".out", token)
            req.session.destroy(function (err) {
                console.log()
                console.log("Destroying session for: ", { token })
                console.log()
            })

        } catch (error) {
            console.log("error " + error)
        }
        res.redirect("/panel-admin")
    }
}