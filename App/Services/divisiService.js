import base from "./baseService.js";

const { view, db } = base
class service extends base {
    constructor() {
        super("divisi")
    }
    async main(req, res) {

        res.send(view.render("divisi", {
            title: "Divisi",
            create: req.flash("create"),
            user: req.session.user,
            update: req.flash("update"),
            deluser: req.flash("hapus"),
            list_user: await db.Divisi.findMany(),
            nosubs: req.flash("nosubs"),
            side: "divisi",
        }))
    }
    async hapus_divisi(req, res) {
        const found = await db.Divisi.findFirst({ where: { div_id: req.params.id - 0 } })
        if (!found)
            return res.redirect("/panel-admin/kriteria")
        const deluser = await db.Divisi.delete({ where: { div_id: req.params.id - 0 } })
        req.flash("hapus", deluser.div_id);

        res.redirect("/panel-admin/divisi")
    }
    async tambah_divisi(req, res) {
        let status = false
        const user = req.body;
        if (!user)
            return res.redirect("/panel-admin/divisi")
        try {
            await db.Divisi.create({
                data: user
            })
            status = true
        } catch (error) {
            console.log("Error creating kriteria " + error)
            status = false;
        }
        req.flash("create", status ? "success" : "error");
        res.redirect("/panel-admin/divisi")
    }
    async show_divisi(req, res) {
        const user = await db.Divisi.findFirst({ where: { div_id: req.params.id - 0 } });
        res.json(user || { res: false })
    }
    async edit_divisi(req, res) {
        let status = false
        const user = req.body;
        if (!user)
            return res.redirect("/panel-admin/divisi")
        try {

            await db.Divisi.update({
                where: { div_id: req.params.id - 0 },
                data: user
            })
            status = true
        } catch (error) {
            console.log("Error updating kriteria " + error)
            status = false;
        }
        req.flash("update", status ? "success" : "error");
        res.redirect("/panel-admin/divisi")
    }
}

export default new service();
