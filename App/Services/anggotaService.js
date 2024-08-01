
import base from "./baseService.js";
import crypto from "crypto-js";
import { validationResult } from "express-validator"
import { env } from "../.config.js";
import matriksService from "./matriksService.js";

let view, db = null
class service extends base {
    constructor() {
        super("anggota")
        view = this.view
        db = this.db
    }
    async main(req, res) {
        res.send(view.render("anggota", {
            title: "Dashboard " + req.session.visitor.nama + " / " + req.session.visitor.uname,
            create: req.flash("masuk") == "true" ? "success" : "",
            hasil: await db.visitor.findFirst({ where: { nim: req.session.visitor.uname }, select: { hasil: true } }),
            user: req.session.visitor,
            kriteria: await db.kriteria.findMany()
        }))
    }

    kuis(req, res) {
        db.visitor
            .findFirst({ where: { nim: req.session.visitor.v_id } })
            .then(async data => {
                if (!data)
                    return res.redirect("/anggota")

                res.send(view.render("kuis-anggota", {
                    title: "Kuisioner Halaman 1",
                    user: req.session.visitor,
                    key: req.session.visitor.v_id,
                    tanya: await db.tanya.findMany({
                        include: { jawab_tanya: true }
                    }),
                }))
            })
    }
    jawab(req, res) {
        db.visitor
            .findFirst({ where: { nim: req.session.visitor.uname } })
            .then(async data => {
                if (!data)
                    return res.redirect("/anggota")

                const divisi = await db.divisi.findMany()
                const sub = await db.sub_kriteria.findMany({
                    where: { kriteria: { tipe: "NILAI" } }
                });

                const val = Object.entries(req.body).map(m => {
                    return m[1].split(";");
                });

                const total = [];
                for (const d of divisi) {
                    const dsub = [];
                    for (const ss of sub) {
                        const s = { ...ss }
                        s.score = 0;
                        for (const v of val)
                            if (v[0] == s.sk_id && d.div_id == v[1]) {
                                s.score += v[2] - 0
                            }
                        dsub.push(s)
                    }
                    d.sub = dsub;
                    total.push(d)
                }

                for (const t of total) {
                    for (const d of t.sub) {
                        const param = {
                            visitor: data.v_id - 0,
                            sub: d.sk_id - 0,
                            divisi: t.div_id - 0
                        }

                        const isi = {
                            ...param,
                            val: d.score
                        }

                        const find = await db.penilaian.findFirst({ where: param })
                        if (!find)
                            await db.penilaian.create({
                                data: { ...isi }
                            })
                        else
                            await db.penilaian.update({
                                data: { ...isi }, where: {
                                    p_id: find.p_id
                                }
                            })

                    }
                }
                res.redirect("/anggota/kuesioner/page/2")
            })
    }
    minat(req, res) {
        db.visitor
            .findFirst({ where: { nim: req.session.visitor.uname } })
            .then(async data => {
                if (!data)
                    return res.redirect("/anggota")
                const nilai = await db.penilaian.findFirst({ where: { visitor: data.v_id } })
                if (!nilai)
                    return res.redirect("/anggota/kuesioner/page/1");

                const kriteria = await db.kriteria.findMany({
                    where: { tipe: "MINAT" },
                    include: { sub: true }
                })

                const divisi = await db.divisi.findMany();

                res.send(view.render("minat-anggota", {
                    title: "Kuesioner Halaman 2",
                    user: req.session.visitor,
                    key: req.session.visitor.id,
                    divisi, kriteria,
                }))

            })
    }
    hitung_minat(req, res) {
        db.visitor
            .findFirst({ where: { nim: req.session.visitor.uname } })
            .then(async data => {
                if (!data)
                    return res.redirect("/anggota")

                const divisi = await db.divisi.findMany()
                let kriteria = await db.kriteria.findMany({ where: { tipe: "MINAT" }, include: { sub: true } })

                const result = [];

                const { body } = req;

                kriteria = await Promise.all(kriteria.map(async m => {
                    const temp = [];

                    for (const d of divisi) {
                        for (const b of Object.entries(body)) {
                            const bb = b[1].split(";")

                            if (bb[0] == m.k_id && bb[1] == d.div_id) {
                                const condition = {
                                    divisi: d.div_id - 0,
                                    kriteria: m.k_id - 0,
                                    visitor: data.v_id - 0,
                                }

                                const find = await db.peminatan.findFirst({ where: condition })

                                if (!find)
                                    await db.peminatan.create({
                                        data: { ...condition, sub: bb[2] - 0 }
                                    })
                                else
                                    await db.peminatan.update({
                                        where: { ...condition, p_id: find.p_id },
                                        data: { sub: bb[2] - 0 }
                                    })

                                d.val = bb[2]
                            }
                        }
                        temp.push(d)
                    }
                    return temp;
                }))


                res.redirect("/anggota/pembobotan")
            })
    }
    bobot(req, res) {
        db.visitor
            .findFirst({ where: { nim: req.session.visitor.uname } })
            .then(async data => {
                if (!data)
                    return res.redirect("/anggota")

                const penilaian = await db.penilaian.findMany({ where: { visitor: data.v_id } })

                if (penilaian.length < 1)
                    return res.redirect(`/anggota/kuesioner/page/1`)

                const peminatan = await db.peminatan.findMany({ where: { visitor: data.v_id } })

                if (peminatan.length < 1)
                    return res.redirect(`/anggota/kuesioner/page/2`)

                const divisi = await db.divisi.findMany();

                const kriteria = await db.kriteria.findMany();
                const sub = await db.sub_kriteria.findMany({
                    include: {
                        kriteria: true
                    }
                });

                let result = [];

                for (const d of divisi)
                    result.push({ id: d.div_id, divisi: d.nama })

                result = result.map(d => {
                    const ktemp = []
                    for (const k of kriteria)
                        ktemp.push({ kid: k.k_id, nama: k.nama, tipe: k.tipe })
                    d.kriteria = ktemp;
                    return d
                })


                result = result.map(d => {
                    let i = 0;
                    for (const k of d.kriteria) {
                        if (k.tipe == "NILAI") {
                            const stemp = [];
                            for (const s of sub)
                                if (s.kriteria.k_id == k.kid) {
                                    const ss = { sid: s.sk_id, nama: s.nama }
                                    for (const p of penilaian)
                                        if (p.divisi == d.id && p.sub == s.sk_id)
                                            ss.val = p.val
                                    stemp.push(ss)
                                }

                            k.sub = stemp
                            d.kriteria[i] = k
                        }
                        else {
                            for (const p of peminatan)
                                if (k.kid == p.kriteria && d.id == p.divisi)
                                    d.kriteria[i].val = p.sub
                        }
                        i++
                    }
                    return d
                })

                const keigen = await generate_pv(db.mKriteria, "k_id", kriteria)

                const seigen = await Promise.all(kriteria.map(async k => {
                    return await generate_pv(db.mSub, "sk_id",
                        await db.sub_kriteria.findMany({ where: { kriteria: { k_id: k.k_id } } }),
                        { where: { msub_k1: { k: k.k_id - 0 } }, })
                }))

                const deigen = await Promise.all((await db.sub_kriteria.findMany({ where: { kriteria: { tipe: "NILAI" } } })).map(async m => {
                    return await generate_pv(db.mDiv, "div_id", divisi, {
                        where: { sub: m.sk_id }
                    })
                }))

                result = await Promise.all(result.map(async d => {
                    for (let i = 0; i < kriteria.length; i++) {
                        d.kriteria[i].pv = keigen[i]
                        if (d.kriteria[i].tipe == "NILAI")
                            for (let j = 0; j < seigen[i].length; j++) {
                                d.kriteria[i].sub[j].spv = seigen[i][j]
                            }
                        else {
                            const s = await db.sub_kriteria.findMany({ where: { k: d.kriteria[i].kid } })
                            for (let j = 0; j < s.length; j++)
                                if (s[j].sk_id == d.kriteria[i].val)
                                    d.kriteria[i].spv = seigen[i][j]
                        }
                    }
                    return d
                }))
                for (let i = 0; i < deigen.length; i++) {
                    for (let j = 0; j < deigen[i].length; j++)
                        result[j].kriteria[0].sub[i].dpv = deigen[i][j]
                }

                for (let i = 0; i < result.length; i++) {
                    for (let j = 0; j < result[i].kriteria.length; j++) {
                        if (result[i].kriteria[j].tipe == "NILAI") {
                            const temp = []
                            for (const s of result[i].kriteria[j].sub)
                                temp.push(s.val * s.spv * s.dpv)
                            result[i].kriteria[j].sval = temp
                            result[i].kriteria[j].spv = temp.reduce((a, b) => a + b)
                        }
                    }
                }

                result = result.map(m => m.kriteria.map(k => k.spv * k.pv))

                result = result.map(m => ({ kriteria: m, total: m.reduce((a, b) => a + b) }))

                for (let i = 0; i < result.length; i++)
                    result[i] = { nama: divisi[i].nama, ...result[i] }

                result = result.sort((a, b) => {
                    if (a.total < b.total)
                        return 1
                    if (a.total > b.total)
                        return -1
                    return 0
                })
                db.visitor
                    .update({
                        data: { hasil: JSON.stringify(result) },
                        where: { v_id: data.v_id }
                    })
                    .then(() => {
                        res.redirect("/anggota")
                    })

            })
    }
}
async function generate_pv(data, key, sample, join = {}) {
    const matriks = matriksService.sintesis((await data.findMany(join)), ["k1", "k2", key], sample).map(m => ({ k1: m.k1, k2: m.k2, val: m.val }))

    const total = matriksService.total(matriks, sample, ["k1", key]);

    const eigen = matriksService.eigen(matriks, total, "k1").map(m => m[sample.length + 1])
    return eigen;
}
export default new service();
