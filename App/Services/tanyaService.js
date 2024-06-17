
import base from "./baseService.js";

const { view, db } = base
class service extends base {
    constructor() {
        super("tanya")
    }
    main(req, res) {
        db.Tanya
            .findMany()
            .then(data => {
                res.send(view.render("tanya", {
                    title: "Pertanyaan",
                    create: req.flash("create"),
                    user: req.session.user,
                    update: req.flash("update"),
                    deluser: req.flash("hapus"),
                    list_user: data,
                    side: "pertanyaan",
                }))
            })
    }
    hapus_tanya(req, res) {
        db.Tanya
            .findFirst({
                where: { t_id: req.params.id - 0 }
            })
            .then(found => {
                if (!found)
                    return res.redirect("/panel-admin/pertanyaan")
            })
            .then(() => {
                db.Tanya
                    .delete({ where: { t_id: req.params.id - 0 } })
                    .then(deluser => {
                        req.flash("hapus", deluser.t_id);
                        res.redirect("/panel-admin/pertanyaan")
                    })
            })
    }
    tambah_tanya(req, res) {
        let status = false
        const user = req.body;

        if ((!user))
            return res.redirect("/panel-admin/pertanyaan")

        db.Tanya
            .create({ data: user })
            .then(() => status = true)
            .catch(error => {
                console.log("Error creating tanya " + error)
                status = false;
            })
            .finally(() => {
                req.flash("create", status ? "success" : "error");
                res.redirect("/panel-admin/pertanyaan")
            })
    }
    show_tanya(req, res) {
        db.Tanya
            .findFirst({
                where: { t_id: req.params.id - 0 }
            })
            .then(user => res.json(user || { res: false }))
    }
    edit_tanya(req, res) {
        let status = false
        const user = req.body;

        if (!user)
            return res.redirect("/panel-admin/pertanyaan")

        db.Tanya
            .update({
                where: { t_id: req.params.id - 0 },
                data: user
            })
            .then(() => { status = true })
            .catch(error => {
                console.log("Error updating pertanyaan " + error)
                status = false;
            })
            .finally(() => {
                req.flash("update", status ? "success" : "error");
                res.redirect("/panel-admin/pertanyaan")
            })
    }
}

export default new service();
