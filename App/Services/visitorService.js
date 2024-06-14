
import base from "./baseService.js";

const { view, db } = base
class service extends base {
    constructor() {
        super("visitor")
    }
    async main(req, res) {

        res.send(view.render("visitor", {
            title: "Visitor",
            create: req.flash("create"),
            user: req.session.user,
            update: req.flash("update"),
            deluser: req.flash("hapus"),
            list_user: await db.Visitor.findMany(),
            side: "visitor",
        }))
    }
    async hapus_visitor(req, res) {
        const found = await db.Visitor.findFirst({ where: { v_id: req.params.id - 0 } })
        if (!found)
            return res.redirect("/panel-admin/visitor")
        const deluser = await db.Visitor.delete({ where: { v_id: req.params.id - 0 } })
        req.flash("hapus", deluser.v_id);

        res.redirect("/panel-admin/visitor")
    }
    async tambah_visitor(req, res) {
        let status = false
        const user = req.body;
        if (!user)
            return res.redirect("/panel-admin/visitor")
        try {
            await db.Visitor.create({
                data: user
            })
            status = true
        } catch (error) {
            console.log("Error creating Visitor " + error)
            status = false;
        }
        req.flash("create", status ? "success" : "error");
        res.redirect("/panel-admin/visitor")
    }
    async show_visitor(req, res) {
        const user = await db.Visitor.findFirst({ where: { v_id: req.params.id - 0 } });
        res.json(user || { res: false })
    }
    async edit_visitor(req, res) {
        let status = false
        const user = req.body;
        if (!user)
            return res.redirect("/panel-admin/visitor")
        try {

            await db.Visitor.update({
                where: { v_id: req.params.id - 0 },
                data: user
            })
            status = true
        } catch (error) {
            console.log("Error updating visitor " + error)
            status = false;
        }
        req.flash("update", status ? "success" : "error");
        res.redirect("/panel-admin/visitor")
    }
}

export default new service();
