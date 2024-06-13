
import base from "./baseService.js";

const { view, db } = base
class service extends base {
    constructor() {
        super("kriteria")
    }
    async main(req, res) {

        res.send(view.render("kriteria", {
            title: "Kriteria",
            create: req.flash("create"),
            user: req.session.user,
            update: req.flash("update"),
            deluser: req.flash("hapus"),
            list_user: await db.Kriteria.findMany(),
            nosubs: req.flash("nosubs"),
            side: "kriteria",
        }))
    }
    async hapus_kriteria(req, res) {
        const found = await db.Kriteria.findUnique({ where: { k_id: req.params.id - 0 } })
        if (!found)
            return res.redirect("/panel-admin/kriteria")
        const deluser = await db.Kriteria.delete({ where: { k_id: req.params.id - 0 } })
        req.flash("hapus", deluser.k_id);

        res.redirect("/panel-admin/kriteria")
    }
    async tambah_kriteria(req, res) {
        let status = false
        const user = req.body;
        if (!user)
            return res.redirect("/panel-admin/kriteria")
        try {
            await db.Kriteria.create({
                data: user
            })
            status = true
        } catch (error) {
            console.log("Error creating kriteria " + error)
            status = false;
        }
        req.flash("create", status ? "success" : "error");
        res.redirect("/panel-admin/kriteria")
    }
    async show_kriteria(req, res) {
        const user = await db.Kriteria.findUnique({ where: { k_id: req.params.id - 0 } });
        res.json(user || { res: false })
    }
    async edit_kriteria(req, res) {
        let status = false
        const user = req.body;
        if (!user)
            return res.redirect("/panel-admin/kriteria")
        try {

            await db.Kriteria.update({
                where: { k_id: req.params.id - 0 },
                data: user
            })
            status = true
        } catch (error) {
            console.log("Error updating kriteria " + error)
            status = false;
        }
        req.flash("update", status ? "success" : "error");
        res.redirect("/panel-admin/kriteria")
    }

}

export default new service();
