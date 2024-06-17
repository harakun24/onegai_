import base from "./baseService.js";

const { view, db } = base
class service extends base {

    constructor() {
        super("divisi")
    }

    main(req, res) {
        db.Divisi
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
        db.Divisi
            .findFirst({
                where: { div_id: req.params.id - 0 }
            })
            .then(found => {
                if (!found)
                    return res.redirect("/panel-admin/kriteria")
            })
            .then(() => {
                db.Divisi
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

        db.Divisi
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
        db.Divisi
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

        db.Divisi
            .update({
                where: { div_id: req.params.id - 0 },
                data: user
            })
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
