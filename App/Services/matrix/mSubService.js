
import base from "../baseService.js";
import matriksService from "../matriksService.js";

let view, db = null

class service extends base {
    constructor() {
        super("mSubkriteria")
        view = this.view
        db = this.db
    }
    main(req, res) {
        if (!req.params.id)
            return res.redirect("/panel-admin/kriteria");

        db.kriteria
            .findFirst({ where: { k_id: req.params.id - 0 } })
            .then(k_temp => {
                if (!k_temp)
                    return res.redirect("/panel-admin/kriteria");
            })
            .then(async () => {
                let k_temp = await db.sub_kriteria.findMany({
                    where: { k: req.params.id - 0 }
                });

                if (k_temp.length < 1)
                    return res.redirect("/panel-admin/kriteria")

                const kriteria = await db.sub_kriteria.findMany({
                    where: { k: req.params.id - 0 }
                });

                const join = {
                    where: { msub_k1: { k: req.params.id - 0 } },
                    include: {
                        msub_k1: true,
                        msub_k2: true,
                    }
                }
                const pair = matriksService.pair(kriteria, "sk_id")
                let mpair = await db.mSub.findMany(join);

                if (mpair.length == 0)
                    await db.mSub.createMany({
                        data: pair.map(m => ({
                            k1: m[0].sk_id,
                            k2: m[1].sk_id,
                            val: 2
                        }))
                    })

                mpair = await db.mSub.findMany(join);

                res.send(
                    view.render("matriks/mSub", {
                        title: "Matriks Sub Kriteria",
                        user: req.session.user,
                        kriteria,
                        idk: req.params.id,
                        idn: await db.kriteria.findFirst({
                            where: { k_id: req.params.id - 0 }
                        }),
                        mKriteria: mpair,
                        side: "subkriteria",
                    })
                )
            })
    }

    getTable(req, res) {

        db.sub_kriteria
            .findMany({ where: { k: req.params.id - 0 } })
            .then(async (kriteria) => {
                const join = {
                    where: { msub_k1: { k: req.params.id - 0 } },
                    include: {
                        msub_k1: true,
                        msub_k2: true,
                    }
                }

                const pair = matriksService.pair(kriteria, "sk_id")
                let mpair = await db.mSub.findMany(join);

                if (mpair.length == 0)
                    await db.mSub.createMany({
                        data: pair.map(m => ({
                            k1: m[0].sk_id,
                            k2: m[1].sk_id,
                            val: 2
                        }))
                    })

                mpair = await db.mSub.findMany(join);

                const table = matriksService.sintesis(mpair, ["k1", "k2", "sk_id"], kriteria)
                const total = matriksService.total(table, kriteria, ["k1", "sk_id"]);
                const eigen = matriksService.eigen(table, total, "k1")
                const konsis = matriksService.uji(total, eigen)

                res.send(
                    view.render("./component/msub-table", {
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
            db.mSub
                .update({
                    data: {
                        val: (req.query.val - 0) < 0 ? 1 / ((req.query.val - 0) * -1) : req.query.val - 0
                    }, where: { mk_id: req.params.id - 0 }
                })
                .then(() => status = "true")
                .catch(error => console.log(error))
                .finally(() => {
                    req.flash("status", status);
                    res.redirect(`/panel-admin/sub/matriks/${req.params.idParent}/table`)
                })
    }
}

export default new service();
