
import base from "./baseRoute.js";
import service from "../Services/divisiService.js";
class router extends base {
    constructor() {
        super("divisi");

        this.method = {
            get: [
                ["/", service.main],
                ["/:id(\\d+)", service.show_divisi],
                ["/:id(\\d+)/hapus", service.hapus_divisi],

            ],
            post: [
                ["/tambah", service.tambah_divisi],
                ["/:id(\\d+)/ubah", service.edit_divisi],
            ],
        }
    }
}

export default new router();
