
import base from "./baseRoute.js";
import service from "../Services/kriteriaService.js";
import mKriteriaService from "../Services/matrix/mKriteriaService.js";
class router extends base {
    constructor() {
        super("kriteria");

        this.method = {
            get: [
                ["/", service.main],
                ["/:id(\\d+)", service.show_kriteria],
                ["/:id(\\d+)/hapus", service.hapus_kriteria],
                ["/matriks", mKriteriaService.main],
                ["/matriks/table", mKriteriaService.getTable],
                ["/matriks/update/:id(\\d+)", mKriteriaService.update]

            ],
            post: [
                ["/tambah", service.tambah_kriteria],
                ["/:id(\\d+)/ubah", service.edit_kriteria],
            ],
        }
    }
}

export default new router();
