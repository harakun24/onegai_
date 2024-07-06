
import base from "./baseRoute.js";
import service from "../Services/jawabService.js";
class router extends base {
    constructor() {
        super("jawab");

        this.method = {
            get: [
                ["/:id(\\d+)", service.show_jawab],
                ["/:id(\\d+)/hapus", service.hapus_jawab],

            ],
            post: [
                ["/tambah", service.tambah_jawab],
                ["/:id(\\d+)/ubah", service.edit_jawab],
            ],
        }
    }
}

export default new router();
