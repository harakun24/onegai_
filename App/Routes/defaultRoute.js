import base from "./baseRoute.js";
import defaultService from "../Services/defaultService.js";
class router extends base {
    constructor() {

        super("/");

        this.method = {
            get: [
                ["/", defaultService.main],
                ["/panel_login", defaultService.login_panel],
            ],
            post: [
                ["/login-auth", defaultService.login_auth]
            ]
        }
    }
}

export default new router();