
import base from "./baseService.js";

const { view, db } = base
const parent = await db.Kriteria.findMany();

class service extends base {
    constructor() {
        super("subkriteria")
    }

    main(req, res) {
        let id = req.flash("subs") - 0;

        if (!parent.length) {
            req.flash("nosubs", true);
            return res.redirect("/panel-admin/kriteria")
        }

        db.Kriteria
            .findFirst(id ? { where: { k_id: id } } : {})
            .then(find => {
                console.log({ find })
                if (!find) {
                    req.flash("nosubs", true);
                    return res.redirect("/panel-admin/kriteria")
                }
                else
                    res.redirect(`/panel-admin/sub/kriteria/${find.k_id}`)
            })
    }

    kriteria(req, res) {
        if (!req.params.id)
            return res.redirect("/panel-admin/sub")

        db.Kriteria
            .findFirst({
                where: { k_id: req.params.id - 0 }
            })
            .then(status => {
                if (!status) {
                    req.flash("nosubs", true);
                    return res.redirect("/panel-admin/kriteria")
                }
                return status
            })
            .then((status) => {
                db.Sub_kriteria
                    .findMany({
                        where: { kriteria: { k_id: req.params.id - 0 } }
                    })
                    .then(data => {
                        console.log({ status })
                        res.send(
                            view.render("sub", {
                                create: req.flash("create"),
                                update: req.flash("update"),
                                deluser: req.flash("hapus"),
                                user: req.session.user,
                                krit: req.params.id,
                                title: "Sub Kriteria",
                                side: "subkriteria",
                                list_user: data,
                                parent,
                                status,
                            }))
                    })
            })
    }

    hapus_sub(req, res) {

        db.Sub_kriteria
            .findFirst({ where: { sk_id: req.params.id - 0 } })
            .then(found => {
                if (!found)
                    return res.redirect("/panel-admin/sub")
            })
            .then(() => {
                db.Sub_kriteria
                    .delete({ where: { sk_id: req.params.id - 0 } })
                    .then(deluser => {
                        req.flash("hapus", deluser.sk_id);
                        req.flash("subs", deluser.k);

                        res.redirect("/panel-admin/sub/kriteria/" + deluser.k)
                    })
            })
    }

    tambah_sub(req, res) {
        let status = false
        const user = req.body;
        if (!user)
            return res.redirect("/panel-admin/sub")

        user.k = user.k - 0

        db.Sub_kriteria
            .create({ data: user })
            .then(() => status = true)
            .catch(error => {
                console.log("Error creating Sub kriteria " + error)
                status = false;
            })
            .finally(() => {
                req.flash("create", status ? "success" : "error");
                req.flash("subs", user.k);
                res.redirect("/panel-admin/sub")
            })
    }
    show_sub(req, res) {
        db.Sub_kriteria
            .findFirst({ where: { sk_id: req.params.id - 0 } })
            .then(user =>
                res.json(user || { res: false })
            )

    }
    edit_sub(req, res) {
        let status = false
        const user = req.body;
        if (!user)
            return res.redirect("/panel-admin/kriteria")

        req.flash("subs", req.body.k);
        delete user.k

        db.Sub_kriteria
            .update({
                where: { sk_id: req.params.id - 0 },
                data: user
            })
            .then(() => status = true)
            .catch(error => {
                console.log("Error updating subkriteria " + error)
                status = false;
            })
            .finally(() => {
                req.flash("update", status ? "success" : "error");
                res.redirect("/panel-admin/sub")
            })
    }
}

export default new service();
