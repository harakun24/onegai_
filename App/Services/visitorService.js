
import base from "./baseService.js";
import { validationResult } from "express-validator"

const { view, db } = base
class service extends base {
    constructor() {
        super("visitor")
    }

    main(req, res) {
        db.Visitor
            .findMany()
            .then(data =>
                res.send(
                    view.render("visitor", {
                        title: "Visitor",
                        create: req.flash("create"),
                        user: req.session.user,
                        update: req.flash("update"),
                        deluser: req.flash("hapus"),
                        list_user: data,
                        side: "visitor",
                    })
                )
            )
    }

    hapus_visitor(req, res) {
        db.Visitor
            .findFirst({
                where: { v_id: req.params.id - 0 }
            })
            .then(found => {
                if (!found)
                    return res.redirect("/panel-admin/visitor")
            })
            .then(() => {
                db.Visitor
                    .delete({
                        where: { v_id: req.params.id - 0 }
                    })
                    .then(deluser => {
                        req.flash("hapus", deluser.v_id);
                        res.redirect("/panel-admin/visitor")
                    })
            })
    }

    tambah_visitor(req, res) {
        let status = false
        const user = req.body;

        if ((!user))
            return res.redirect("/panel-admin/visitor")

        if (!validationResult(req).isEmpty()) {
            console.log({ msg: validationResult(req).array() })
            return res.redirect("/panel-admin/visitor")
        }

        db.Visitor
            .create({
                data: user
            })
            .then(() => status = true)
            .catch(error => {
                console.log("Error creating Visitor " + error)
                status = false;
            })
            .finally(() => {
                req.flash("create", status ? "success" : "error");
                res.redirect("/panel-admin/visitor")
            })
    }

    show_visitor(req, res) {
        db.Visitor.findFirst({ where: { v_id: req.params.id - 0 } })
            .then(user =>
                res.json(user || { res: false })
            )
    }

    edit_visitor(req, res) {
        let status = false
        const user = req.body;

        if (!user)
            return res.redirect("/panel-admin/visitor")

        db.Visitor
            .update({
                where: { v_id: req.params.id - 0 },
                data: user
            })
            .then(() => status = true)
            .catch(error => {
                console.log("Error updating visitor " + error)
                status = false;
            })
            .finally(() => {
                req.flash("update", status ? "success" : "error");
                res.redirect("/panel-admin/visitor")
            })
    }
}

export default new service();
