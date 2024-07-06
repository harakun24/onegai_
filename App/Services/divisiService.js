import base from "./baseService.js";

let view, db = null

class service extends base {

    constructor() {
        super("divisi")
        view = this.view
        db = this.db
    }

    main(req, res) {
        db.divisi
            .findMany()
            .then(data => {
                res.send(
                    view.render("divisi", {
                        title: "Divisi",
                        create: req.flash("create"),
                        user: req.session.user,
                        update: req.flash("update"),
                        deluser: req.flash("hapus"),
                        list_user: data,
                        nosubs: req.flash("nosubs"),
                        side: "divisi",
                    }))
            })
    }

    hapus_divisi(req, res) {
        db.divisi
            .findFirst({ where: { div_id: req.params.id - 0 } })
            .then(found => {
                if (!found)
                    return res.redirect("/panel-admin/kriteria")
            })
            .then(() => {
                db.divisi
                    .delete({ where: { div_id: req.params.id - 0 } })
                    .then(deluser => {
                        req.flash("hapus", deluser.div_id);
                        res.redirect("/panel-admin/divisi")
                    })
            })
    }

    tambah_divisi(req, res) {
        let status = false
        const user = req.body;

        if (!user)
            return res.redirect("/panel-admin/divisi")

        db.divisi
            .create({ data: user })
            .then(() => status = true)
            .catch(error => {
                console.log("Error creating kriteria " + error)
                status = false;
            })
            .finally(() => {
                req.flash("create", status ? "success" : "error");
                res.redirect("/panel-admin/divisi")
            })
    }

    show_divisi(req, res) {
        db.divisi
            .findFirst({ where: { div_id: req.params.id - 0 } })
            .then(user =>
                res.json(user || { res: false })
            )
    }

    edit_divisi(req, res) {
        let status = false
        const user = req.body;

        if (!user)
            return res.redirect("/panel-admin/divisi")

        db.divisi
            .update({ where: { div_id: req.params.id - 0 }, data: user })
            .then(() => { status = true })
            .catch(error => {
                console.log("Error updating kriteria " + error)
                status = false;
            })
            .finally(() => {
                req.flash("update", status ? "success" : "error");
                res.redirect("/panel-admin/divisi")
            })
    }
}

export default new service();
