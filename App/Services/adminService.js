
import base from "./baseService.js";
import crypto from "crypto-js";
import { env } from "../.config.js";

let view, db = null

class service extends base {

    constructor() {
        super("admin")
        view = this.view
        db = this.db
    }

    main(req, res) {
        db.user
            .findMany()
            .then(async data => {
                const count = {
                    kriteria: await db.kriteria.aggregate({ _count: { k_id: true } }),
                    sub: await db.sub_kriteria.aggregate({ _count: { sk_id: true } }),
                    divisi: await db.divisi.aggregate({ _count: { div_id: true } }),
                    visitor: await db.visitor.aggregate({ _count: { v_id: true } }),

                }
                res.send(
                    view.render("dashboard", {
                        title: "Dashboard",
                        create: req.flash("create"),
                        user: req.session.user || { id: 0 },
                        update: req.flash("update"),
                        deluser: req.flash("hapus"),
                        list_user: data,
                        side: "dashboard",
                        count,
                    })
                )
            })
    }

    hapus_user(req, res) {
        db.user
            .findFirst({ where: { id: req.params.id - 0 } })
            .then(found => {
                if (!found)
                    return res.redirect("/panel-admin")
            })
            .then(() => {
                db.user
                    .delete({ where: { id: req.params.id - 0 } })
                    .then(deluser => {
                        req.flash("hapus", deluser.id);
                        console.log({ deluser })
                        res.redirect("/panel-admin")
                    })
            })
    }

    tambah_user(req, res) {
        let status = false
        const user = req.body;

        if (!user)
            return res.redirect("/panel-admin")

        user.password = crypto.Rabbit.encrypt(user.password, env.SECRET_KEY).toString()

        db.user
            .create({ data: user })
            .then(() => status = true)
            .catch(error => {
                console.log("Error creating user " + error)
                status = false;
            })
            .finally(() => {
                req.flash("create", status ? "success" : "error");
                res.redirect("/panel-admin")
            })
    }

    show_user(req, res) {
        db.user
            .findFirst({ where: { id: req.params.id - 0 } })
            .then(user => res.json(user || { res: false }))
    }

    edit_user(req, res) {
        let status = false
        const user = req.body.password == "" ? { uname: req.body.uname } : req.body;

        if (!user)
            return res.redirect("/panel-admin")

        if (req.body.password != "")
            user.password = crypto.Rabbit.encrypt(user.password, env.SECRET_KEY).toString()

        db.user
            .update({ where: { id: req.params.id - 0 }, data: user })
            .then(() => { status = true })
            .catch(error => {
                console.log("Error updating user " + error)
                status = false;
            })
            .finally(() => {
                req.flash("update", status ? "success" : "error");
                res.redirect("/panel-admin")
            })
    }

}

export default new service();
