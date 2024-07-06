console.log("\n---------------------------\n")

import base from "./baseService.js";
import crypto from "crypto-js";
import { env, logger } from "../.config.js";

let view, db = null

class service extends base {
    constructor() {
        super("default")
        view = this.view
        db = this.db
    }
    main(req, res) {
        res.send(view.render("index"))
    }
    login_panel(req, res) {
        if (req.session.user)
            return res.redirect("/panel-admin")

        res.send(view.render("login", { status: req.flash("status"), title: "Log in" }))
    }
    async login_auth(req, res) {

        if (!(req.body.password && req.body.uname))
            return res.redirect("/panel_login")

        const user = { ...req.body };

        const found = await db.user.findFirst({ where: { uname: user.uname } });

        let status = true;
        let pwd;

        if (!found)
            status = false
        else
            pwd = crypto.Rabbit.decrypt(found.password, env.SECRET_KEY).toString(crypto.enc.Utf8);

        if (user.password != pwd)
            status = false

        req.flash("status", status ? "success" : "error")

        if (!status)
            return res.redirect("/panel_login")

        user.token = crypto.Rabbit.encrypt(JSON.stringify(found) + "", env.SECRET_KEY).toString()
        user.id = found.id;
        req.session.user = user;

        logger(".in", user.token)

        res.redirect('/panel-admin/');
    }
}

export default new service();