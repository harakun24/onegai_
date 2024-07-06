

class service {
    pair(data, key) {
        const result = [];

        for (let i = 0; i < data.length; i++)
            for (let j = i + 1; j < data.length; j++)
                result.push([data[i], data[j]])

        return result
    }

    sintesis(data, key, sample) {
        const dupe = [];
        let reverse = data.map(m => ({ [key[0]]: m[key[1]], [key[1]]: m[key[0]], val: 1 / m.val }));

        for (const s of sample)
            dupe.push({ [key[0]]: s[key[2]], [key[1]]: s[key[2]], val: 1 })

        const result = [...dupe, ...reverse, ...data].sort((a, b) => a[key[0]] - b[key[0]] || a[key[1]] - b[key[1]]);
        return result;
    }

    total(data, sample, key) {
        const result = [];
        const group = [];

        for (const s of sample) {
            result.push(0);
            let temp = [];

            for (const d of data)
                if (d[key[0]] == s[key[1]])
                    temp.push(d.val);

            group.push(temp)
        }
        for (let i = 0; i < sample.length; i++)
            for (let j = 0; j < sample.length; j++)
                result[i] += group[j][i];

        return result;
    }
    eigen(data, total, key) {
        const result = [];
        const group = [];
        const eigen = [];
        const s = new Set();

        for (const d of data)
            s.add(d[key])

        for (const ss of s) {
            const temp = [];

            for (const d of data)
                if (d[key] == ss)
                    temp.push(d)
            group.push(temp)
        }
        for (let i = 0; i < group.length; i++) {
            const temp = group.map(m => m[i].val / total[i]);
            result.push(temp)

        }
        for (let i = 0; i < group.length; i++) {
            let temp = []
            for (let j = 0; j < group.length; j++)
                temp.push(result[j][i])

            const total = temp.reduce((a, b) => a + b, 0)
            temp = [...temp, total, total / group.length]
            eigen.push(temp)
        }

        return eigen;
    }
    uji(total, eigen) {
        const result = [];
        const pv = [];

        for (const e of eigen)
            pv.push(e[total.length + 1])

        for (let i = 0; i < total.length; i++)
            result.push(total[i] * pv[i])

        const lmax = result.reduce((a, b) => a + b)
        const ci = (lmax - total.length) / (total.length - 1)
        const table_ri = [
            [1, 0],
            [2, 0],
            [3, 0.58],
            [4, 0.9],
            [5, 1.12],
            [6, 1.24],
            [7, 1.32],
            [8, 1.41],
            [9, 1.45],
            [10, 1.49],
            [11, 1.51],
            [12, 1.48],
            [13, 1.56],
            [14, 1.57],
            [15, 1.59],
        ];
        const ri = table_ri.filter(m => m[0] == total.length)[0][1]
        const cr = ci / ri;
        return { lmax, ci, ri, cr }

    }
}

export default new service();
