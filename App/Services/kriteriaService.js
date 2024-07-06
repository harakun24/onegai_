
import base from "./baseService.js";

let view, db = null

class service extends base {
    constructor() {
        super("kriteria")
        view = this.view
        db = this.db

    }

    main(req, res) {
        db.kriteria
            .findMany()
            .then(data => {
                res.send(
                    view.render("kriteria", {
                        title: "Kriteria",
                        create: req.flash("create"),
                        user: req.session.user,
                        update: req.flash("update"),
                        deluser: req.flash("hapus"),
                        list_user: data,
                        nosubs: req.flash("nosubs"),
                        side: "kriteria",
                    })
                )
            })
    }

    hapus_kriteria(req, res) {
        db.kriteria
            .findFirst({ where: { k_id: req.params.id - 0 } })
            .then(found => {
                if (!found)
                    return res.redirect("/panel-admin/kriteria")
            })
            .then(() => {
                db.kriteria
                    .delete({ where: { k_id: req.params.id - 0 } })
                    .then(deluser => {
                        req.flash("hapus", deluser.k_id);
                        res.redirect("/panel-admin/kriteria")
                    })
            })
    }

    tambah_kriteria(req, res) {
        let status = false
        const user = req.body;

        if (!user)
            return res.redirect("/panel-admin/kriteria")

        db.kriteria
            .create({ data: user })
            .then(() => status = true)
            .catch(error => {
                console.log("Error creating kriteria " + error)
                status = false;
            })
            .finally(() => {
                req.flash("create", status ? "success" : "error");
                res.redirect("/panel-admin/kriteria")
            })
    }

    show_kriteria(req, res) {
        db.kriteria
            .findFirst({ where: { k_id: req.params.id - 0 } })
            .then(user =>
                res.json(user || { res: false })
            )
    }

    edit_kriteria(req, res) {
        let status = false
        const user = req.body;

        if (!user)
            return res.redirect("/panel-admin/kriteria")

        db.kriteria
            .update({ where: { k_id: req.params.id - 0 }, data: user })
            .then(() => {
                status = true
            })
            .catch(error => {
                console.log("Error updating kriteria " + error)
                status = false;
            })
            .finally(() => {
                req.flash("update", status ? "success" : "error");
                res.redirect("/panel-admin/kriteria")
            })
    }

}

export default new service();
