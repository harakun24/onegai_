
import base from "./baseRoute.js";
import { logger } from "../.config.js";

import service from "../Services/anggotaService.js";
import { body } from "express-validator"
//import service from "../Services/service.js";
class router extends base {
    constructor() {
        super("anggota");

        this.method = {
            get: [
                ["/", (req, res) => res.redirect("/anggota/dashboard")],
                ["/dashboard", service.main],
                ["/keluar", (req, res) => {
                    const { token } = req.session.visitor;

                    logger(".out", token)

                    req.session.destroy(function (err) {
                        console.log()
                        console.log("Destroying session for: ", { token })
                        console.log()
                    })
                    res.redirect("/anggota")
                }],
                ["/kuesioner/page/1", service.kuis],
                ["/kuesioner/page/2", service.minat],
                ["/pembobotan", service.bobot],

            ],
            post: [

                ["/jawab", service.jawab],
                ["/peminatan", service.hitung_minat],
            ]
        }
    }
}

export default new router();
