
import base from "./baseService.js";

let db = null

class service extends base {
    constructor() {
        super("jawab")
        db = this.db
    }

    hapus_jawab(req, res) {
        db.jawab
            .findFirst({ where: { j_id: req.params.id - 0 } })
            .then(found => {
                if (!found)
                    return res.redirect("/panel-admin/pertanyaan")
            })
            .then(() => {
                db.jawab
                    .delete({ where: { j_id: req.params.id - 0 } })
                    .then(deluser => {
                        req.flash("hapus", deluser.t_id);
                        res.redirect("/panel-admin/pertanyaan")
                    })
            })
    }

    tambah_jawab(req, res) {
        let status = false
        const user = req.body;

        if ((!user))
            return res.redirect("/panel-admin/pertanyaan")

        user.sub -= 0
        user.divisi -= 0
        user.tanya -= 0
        user.nilai -= 0

        db.jawab
            .create({ data: user })
            .then(() => status = true)
            .catch(error => {
                console.log("Error creating jawab " + error)
                status = false;
            })
            .finally(() => {
                req.flash("create", status ? "success" : "error");
                res.redirect("/panel-admin/pertanyaan")
            })
    }

    edit_jawab(req, res) {
        let status = false
        const user = req.body;

        if (!user)
            return res.redirect("/panel-admin/pertanyaan")
        user.sub -= 0
        user.divisi -= 0
        user.tanya -= 0
        user.nilai -= 0

        db.jawab
            .update({ where: { j_id: req.params.id - 0 }, data: user })
            .then(() => { status = true })
            .catch(error => {
                console.log("Error updating jawaban " + error)
                status = false;
            })
            .finally(() => {
                req.flash("update", status ? "success" : "error");
                res.redirect("/panel-admin/pertanyaan")
            })
    }

    show_jawab(req, res) {
        db.jawab
            .findFirst({ where: { j_id: req.params.id - 0 }, })
            .then(user => res.json(user || { res: false }))
    }
}

export default new service();
