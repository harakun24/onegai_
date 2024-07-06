
import base from "./baseService.js";

let view, db = null

class service extends base {
    constructor() {
        super("tanya")
        view = this.view
        db = this.db
    }
    main(req, res) {
        db.tanya
            .findMany({
                include: {
                    jawab_tanya: {
                        include: { jawab_sub: true, jawab_divisi: true, }
                    }
                }
            })
            .then(async data => {
                res.send(view.render("tanya", {
                    title: "Pertanyaan",
                    create: req.flash("create"),
                    user: req.session.user,
                    update: req.flash("update"),
                    deluser: req.flash("hapus"),
                    list_user: data,
                    sub: await db.sub_kriteria.findMany({
                        where: { kriteria: { tipe: "NILAI" } }
                    }),
                    div: await db.Divisi.findMany(),
                    side: "pertanyaan",
                }))
            })
    }
    hapus_tanya(req, res) {
        db.tanya
            .findFirst({ where: { t_id: req.params.id - 0 } })
            .then(found => {
                if (!found)
                    return res.redirect("/panel-admin/pertanyaan")
            })
            .then(() => {
                db.tanya
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

        db.tanya
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
        db.tanya
            .findFirst({ where: { t_id: req.params.id - 0 } })
            .then(user => res.json(user || { res: false }))
    }
    edit_tanya(req, res) {
        let status = false
        const user = req.body;

        if (!user)
            return res.redirect("/panel-admin/pertanyaan")

        db.tanya
            .update({ where: { t_id: req.params.id - 0 }, data: user })
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
