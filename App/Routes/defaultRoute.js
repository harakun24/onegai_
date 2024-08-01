import base from "./baseRoute.js";
import defaultService from "../Services/defaultService.js";
import { body } from "express-validator"

class router extends base {
    constructor() {

        super("/");

        this.method = {
            get: [
                ["/", defaultService.main],
                ["/panel_login", defaultService.login_panel],
            ],
            post: [
                ["/login-auth", defaultService.login_auth],
                ["/daftar", [
                    body("nim").matches(/^\d{2}\.\d{2}\.\d{4}$/).withMessage("format nim salah")
                ], defaultService.daftar],
            ]
        }
    }
}

export default new router();