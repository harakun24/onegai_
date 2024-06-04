import { view } from "../.config.js"
import { PrismaClient } from "@prisma/client";

export default class {
    static view = view
    static db = new PrismaClient();
    constructor(name) {
        console.log(`   @@ Service ${name}`)
    }
}