import base from "../baseService.js";
import matriksService from "../matriksService.js";

let view, db = null

class service extends base {
    constructor() {
        super("mKriteria")
        view = this.view
        db = this.db
    }
    main(req, res) {
        db.kriteria
            .findFirst()
            .then(async k_temp => {

                if (!k_temp)
                    return res.redirect("/panel-admin/kriteria");
                const kriteria = await db.kriteria.findMany();

                const join = {
                    include: {
                        mkriteria_k1: true,
                        mkriteria_k2: true,
                    }
                }
                const pair = matriksService.pair(kriteria, "k_id")
                let mpair = await db.mKriteria.findMany(join);

                if (mpair.length == 0)
                    await db.mKriteria.createMany({
                        data: pair.map(m => ({
                            k1: m[0].k_id,
                            k2: m[1].k_id,
                            val: 2
                        }))
                    })
                mpair = await db.mKriteria.findMany(join);

                // konsis.cr = 9
                res.send(
                    view.render("matriks/mkriteria", {
                        title: "Matriks Kriteria",
                        user: req.session.user,
                        kriteria,
                        mKriteria: mpair,
                        side: "kriteria",
                    }))
            })
    }

    getTable(req, res) {
        db.kriteria
            .findMany()
            .then(async kriteria => {
                const join = {
                    include: {
                        mkriteria_k1: true,
                        mkriteria_k2: true,
                    }
                }
                const pair = matriksService.pair(kriteria, "k_id")
                let mpair = await db.mKriteria.findMany(join);

                if (mpair.length == 0)
                    await db.mKriteria.createMany({
                        data: pair.map(m => ({
                            k1: m[0].k_id,
                            k2: m[1].k_id,
                            val: 2
                        }))
                    })

                mpair = await db.mKriteria.findMany(join);
                const table = matriksService.sintesis(mpair, ["k1", "k2", "k_id"], kriteria)
                const total = matriksService.total(table, kriteria, ["k1", "k_id"]);
                const eigen = matriksService.eigen(table, total, "k1")
                const konsis = matriksService.uji(total, eigen)

                res.send(
                    view.render("./component/mkriteria-table", {
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
            db.mKriteria
                .update({
                    data: {
                        val: (req.query.val - 0) < 0 ? 1 / ((req.query.val - 0) * -1) : req.query.val - 0
                    }, where: { mk_id: req.params.id - 0 }
                })
                .then(() => status = "true")
                .catch(error => console.log(error))
                .finally(() => {
                    req.flash("status", status);
                    res.redirect("/panel-admin/kriteria/matriks/table")
                })
    }
}

export default new service();