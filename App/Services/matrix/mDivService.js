
import base from "../baseService.js";
import matriksService from "../matriksService.js";

let view, db = null

class service extends base {
    constructor() {
        super("mDivisi")
        view = this.view
        db = this.db
    }
    main(req, res) {
        if (!req.params.id)
            return res.redirect("/panel-admin/sub");

        db.sub_kriteria
            .findFirst({
                where: { sk_id: req.params.id - 0 }
            })
            .then(k_temp => {
                if (!k_temp)
                    return res.redirect("/panel-admin/sub");
            })
            .then(async () => {
                let k_temp = await db.Divisi.findMany();

                if (k_temp.length < 1)
                    return res.redirect("/panel-admin/sub")

                const kriteria = k_temp;

                const join = {
                    where: {
                        mdiv_sub: { sk_id: req.params.id - 0 }
                    },
                    include: {
                        mdiv_k1: true,
                        mdiv_k2: true,
                        mdiv_sub: true,
                    }
                }
                const pair = matriksService.pair(kriteria, "div_id")
                let mpair = await db.mDiv.findMany(join);

                if (mpair.length == 0)
                    await db.mDiv.createMany({
                        data: pair.map(m => ({
                            k1: m[0].div_id,
                            k2: m[1].div_id,
                            sub: req.params.id - 0,
                            val: 2
                        }))
                    })

                mpair = await db.mDiv.findMany(join);

                res.send(
                    view.render("matriks/mDiv", {
                        title: "Matriks Divisi",
                        user: req.session.user,
                        kriteria,
                        idk: req.params.id,
                        idn: await db.sub_kriteria
                            .findFirst({
                                where: { sk_id: req.params.id - 0 }
                            }),
                        mKriteria: mpair,
                        side: "divisi",
                    })
                )
            })
    }

    getTable(req, res) {

        db.divisi
            .findMany()
            .then(async (kriteria) => {
                const join = {
                    where: {
                        mdiv_sub: { sk_id: req.params.id - 0 }
                    },
                    include: {
                        mdiv_k1: true,
                        mdiv_k2: true,
                        mdiv_sub: true,
                    }
                }

                const pair = matriksService.pair(kriteria, "div_id")
                let mpair = await db.mDiv.findMany(join);

                if (mpair.length == 0)
                    await db.mDiv.createMany({
                        data: pair.map(m => ({
                            k1: m[0].div_id,
                            k2: m[1].div_id,
                            sub: req.params.id - 0,
                            val: 2
                        }))
                    })

                mpair = await db.mDiv.findMany(join);

                const table = matriksService.sintesis(mpair, ["k1", "k2", "div_id"], kriteria)
                const total = matriksService.total(table, kriteria, ["k1", "div_id"]);
                const eigen = matriksService.eigen(table, total, "k1")
                const konsis = matriksService.uji(total, eigen)

                res.send(
                    view.render("./component/mdiv-table", {
                        mKriteria: mpair,
                        table,
                        kriteria,
                        total,
                        konsis,
                        eigen,
                        status: req.flash("status")
                    })
                )
            })
    }

    update(req, res) {
        let status = "false";
        if (req.query.val)
            db.mDiv
                .update({
                    data: {
                        val: (req.query.val - 0) < 0 ? 1 / ((req.query.val - 0) * -1) : req.query.val - 0
                    }, where: {
                        mk_id: req.params.id - 0
                    }
                })
                .then(() => status = "true")
                .catch(error => console.log(error))
                .finally(() => {
                    req.flash("status", status);
                    res.redirect(`/panel-admin/divisi/matriks/${req.params.idParent}/table`)
                })
    }
}

export default new service();
