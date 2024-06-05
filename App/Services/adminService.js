
import base from "./baseService.js";
import crypto from "crypto-js";
import { env } from "../.config.js";

const { view, db } = base
class service extends base {
    constructor() {
        super("admin")
    }
    async main(req, res) {
        res.send(view.render("dashboard", {
            title: "Dashboard",
            create: req.flash("create"),
            user: req.session.user,
            update: req.flash("update"),
            deluser: req.flash("hapus"),
            list_user: await db.User.findMany(),
            side: "dashboard",
        }))
    }
    async hapus_user(req, res) {
        const found = await db.User.findUnique({ where: { id: req.params.id - 0 } })
        if (!found)
            return res.redirect("/panel-admin")
        const deluser = await db.User.delete({ where: { id: req.params.id - 0 } })
        req.flash("hapus", deluser.id);

        console.log({ deluser })

        res.redirect("/panel-admin")
    }
    async tambah_user(req, res) {
        let status = false
        const user = req.body;
        if (!user)
            return res.redirect("/panel-admin")
        try {
            user.password = crypto.Rabbit.encrypt(user.password, env.SECRET_KEY).toString()
            await db.User.create({
                data: user
            })
            status = true
        } catch (error) {
            console.log("Error creating user " + error)
            status = false;
        }
        req.flash("create", status ? "success" : "error");
        res.redirect("/panel-admin")
    }
    async show_user(req, res) {
        const user = await db.User.findUnique({ where: { id: req.params.id - 0 } });
        res.json(user || { res: false })
    }
    async edit_user(req, res) {
        let status = false
        const user = req.body.password == "" ? { uname: req.body.uname } : req.body;
        if (!user)
            return res.redirect("/panel-admin")
        try {
            if (req.body.password != "")
                user.password = crypto.Rabbit.encrypt(user.password, env.SECRET_KEY).toString()
            await db.User.update({
                where: { id: req.params.id - 0 },
                data: user
            })
            status = true
        } catch (error) {
            console.log("Error updating user " + error)
            status = false;
        }
        req.flash("update", status ? "success" : "error");
        res.redirect("/panel-admin")
    }

}

export default new service();
