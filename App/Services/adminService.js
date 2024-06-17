
import base from "./baseService.js";
import crypto from "crypto-js";
import { env } from "../.config.js";

const { view, db } = base
class service extends base {

    constructor() {
        super("admin")
    }

    main(req, res) {
        db.User
            .findMany()
            .then(data => {
                res.send(
                    view.render("dashboard", {
                        title: "Dashboard",
                        create: req.flash("create"),
                        user: req.session.user || { id: 0 },
                        update: req.flash("update"),
                        deluser: req.flash("hapus"),
                        list_user: data,
                        side: "dashboard",
                    })
                )
            })
    }

    hapus_user(req, res) {
        db.User
            .findFirst({
                where: { id: req.params.id - 0 }
            })
            .then(found => {
                if (!found)
                    return res.redirect("/panel-admin")
            })
            .then(() => {
                db.User
                    .delete({
                        where: { id: req.params.id - 0 }
                    })
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
        db.User
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
        db.User
            .findFirst({
                where: { id: req.params.id - 0 }
            })
            .then(user => res.json(user || { res: false }))
    }

    edit_user(req, res) {
        let status = false
        const user = req.body.password == "" ? { uname: req.body.uname } : req.body;

        if (!user)
            return res.redirect("/panel-admin")

        if (req.body.password != "")
            user.password = crypto.Rabbit.encrypt(user.password, env.SECRET_KEY).toString()

        db.User
            .update({
                where: { id: req.params.id - 0 },
                data: user
            })
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
