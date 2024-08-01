import { view, logger } from "../.config.js"
import { PrismaClient } from "@prisma/client";
import "colors";

export default class {
    view = view
    db = new PrismaClient();
    constructor(name) {

        console.log(`    -- Service `.green + `${name}`.cyan)
    }
    keluar(req, res) {
        console.log("logout")
        try {
            const { token } = req.session.user ? req.session.user : req.session.visitor ? req.session.visitor : false;

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