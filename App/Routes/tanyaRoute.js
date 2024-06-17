
import base from "./baseRoute.js";
import service from "../Services/tanyaService.js";
class router extends base {
    constructor() {
        super("tanya");

        this.method = {
            get: [
                ["/", service.main],
                ["/:id(\\d+)", service.show_tanya],
                ["/:id(\\d+)/hapus", service.hapus_tanya],
            ],
            post: [
                ["/tambah", service.tambah_tanya],
                ["/:id(\\d+)/ubah", service.edit_tanya],
            ],
        }
    }
}

export default new router();
