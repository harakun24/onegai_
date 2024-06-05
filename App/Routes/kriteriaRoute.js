
import base from "./baseRoute.js";
import service from "../Services/kriteriaService.js";
class router extends base {
    constructor() {
        super("kriteria");

        this.method = {
            get: [
                ["/", service.main],
                ["/:id(\\d+)", service.show_kriteria],
                ["/:id(\\d+)/hapus", service.hapus_kriteria],
            ],
            post: [
                ["/tambah", service.tambah_kriteria],
                ["/:id(\\d+)/ubah", service.edit_kriteria],
            ],
        }
    }
}

export default new router();
