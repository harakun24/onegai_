console.log("\n---------------------------\n")

import base from "./baseService.js";
import crypto from "crypto-js";
import { env, logger } from "../.config.js";
import { validationResult } from "express-validator"


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
        else if (req.session.visitor)
            return res.redirect("/anggota")

        res.send(view.render("login", { status: req.flash("status"), msg: req.flash("msg"), create: req.flash("create"), title: "Log in" }))
    }
    async login_auth(req, res) {

        if (!(req.body.password && req.body.uname))
            return res.redirect("/panel_login")

        const user = { ...req.body };
        let tipe = "admin";
        if (user.uname.match(/\d{2}.\d{2}.\d{4}$/))
            tipe = "anggota"

        const found = tipe == "admin" ? await db.user.findFirst({ where: { uname: user.uname } }) : await db.visitor.findFirst({ where: { nim: user.uname } });

        let status = true;
        let pwd;

        if (!found)
            status = false
        else
            pwd = crypto.Rabbit.decrypt(found.password, env.SECRET_KEY).toString(crypto.enc.Utf8);

        if (user.password != pwd)
            status = false

        req.flash("status", status ? "success" : "error")

        if (!status) {

            return res.redirect("/panel_login")
        }
        user.token = crypto.Rabbit.encrypt(JSON.stringify(found) + "", env.SECRET_KEY).toString()
        delete user.password
        if (tipe == "admin") {
            user.id = found.id;
            req.session.user = user;
        } else {
            user.id = found.v_id;
            user.nama = found.nama;
            req.session.visitor = user;
        }

        logger(".in", user.token)
        req.flash("masuk", "true");
        return res.redirect(tipe == "admin" ? '/panel-admin/' : "/anggota/");
    }
    async daftar(req, res) {
        let status = true
        const user = req.body;

        if ((!user))
            status = false

        if (!validationResult(req).isEmpty()) {
            console.log({ msg: validationResult(req).array() })
            req.flash("create", "error")
            req.flash("msg", "format nim salah")
            return res.redirect("/panel_login")
        }
        if (user.password.length < 6) {
            req.flash("create", "error")
            req.flash("msg", "format password salah, minimal 6 karakter")
            return res.redirect("/panel_login")
        }
        user.password = crypto.Rabbit.encrypt(user.password, env.SECRET_KEY).toString()
        console.log("membuat visitor")
        db.visitor
            .create({ data: user })
            .then(() => status = true)
            .catch(error => {
                console.log("Error creating Visitor " + error)
                status = false;
                console.log("ini error")
                req.flash("msg", `${error.message.replace(/\n/g, "")}`);
            })
            .finally(() => {
                req.flash("create", status ? "success" : "error");
                res.redirect("/panel_login")
            })
    }
}

export default new service();