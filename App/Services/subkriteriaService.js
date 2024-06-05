
import base from "./baseService.js";

const { view, db } = base
const parent = await db.Kriteria.findMany();
class service extends base {
    constructor() {
        super("subkriteria")
    }
    async main(req, res) {
        let id = req.flash("subs") - 0;

        if (!parent.length) {
            req.flash("nosubs", true);
            return res.redirect("/panel-admin/kriteria")
        }
        const find = id ? await db.Kriteria.findFirst({ where: { k_id: id } }) : await db.Kriteria.findFirst();


        if (!find) {
            req.flash("nosubs", true);
            return res.redirect("/panel-admin/kriteria")
        }

        res.redirect(`/panel-admin/sub/kriteria/${find.k_id}`)
    }
    async kriteria(req, res) {
        if (!req.params.id)
            return res.redirect("/panel-admin/sub")
        const status = await db.Kriteria.findFirst({
            where: {
                k_id: req.params.id - 0
            }
        })
        if (!status) {
            req.flash("nosubs", true);

            return res.redirect("/panel-admin/kriteria")
        }
        res.send(view.render("sub", {
            title: "Sub Kriteria",
            create: req.flash("create"),
            user: req.session.user,
            update: req.flash("update"),
            deluser: req.flash("hapus"),
            list_user: await db.Sub_kriteria.findMany({
                where: {
                    kriteria: {
                        k_id: req.params.id - 0
                    }
                }
            }),
            krit: req.params.id,
            parent,
            side: "subkriteria",
        }))
    }
    async hapus_sub(req, res) {
        const found = await db.Sub_kriteria.findUnique({ where: { sk_id: req.params.id - 0 } })
        if (!found)
            return res.redirect("/panel-admin/sub")
        const deluser = await db.Sub_kriteria.delete({ where: { sk_id: req.params.id - 0 } })
        req.flash("hapus", deluser.sk_id);
        req.flash("subs", deluser.k);

        res.redirect("/panel-admin/sub/kriteria/" + deluser.k)
    }
    async tambah_sub(req, res) {
        let status = false
        const user = req.body;
        if (!user)
            return res.redirect("/panel-admin/sub")
        try {
            user.k = user.k - 0
            await db.Sub_kriteria.create({
                data: user
            })
            status = true
        } catch (error) {
            console.log("Error creating Sub kriteria " + error)
            status = false;
        }
        req.flash("create", status ? "success" : "error");
        req.flash("subs", user.k);
        res.redirect("/panel-admin/sub")
    }
    async show_sub(req, res) {
        const user = await db.Sub_kriteria.findUnique({ where: { sk_id: req.params.id - 0 } });
        res.json(user || { res: false })
    }
    async edit_sub(req, res) {
        let status = false
        const user = req.body;
        if (!user)
            return res.redirect("/panel-admin/kriteria")
        try {
            req.flash("subs", req.body.k);

            delete user.k
            await db.Sub_kriteria.update({
                where: { sk_id: req.params.id - 0 },
                data: user
            })
            status = true
        } catch (error) {
            console.log("Error updating subkriteria " + error)
            status = false;
        }
        req.flash("update", status ? "success" : "error");
        res.redirect("/panel-admin/sub")
    }
}

export default new service();
