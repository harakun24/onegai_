import fs from "fs";

let temp = await fs.readFileSync("./prisma/template.prisma", "utf8");

async function readMModel(path) {
    return await fs.readFileSync(path, "utf8");
}

const dir = await fs.readdirSync("./prisma/models");

for (const file of dir) {
    console.log({ model: file.split(".")[0] })
    temp += await readMModel(`./prisma/models/${file}`) + "\n"
}


fs.writeFileSync("./prisma/schema.prisma", temp);

