
import base from "./baseRoute.js";
import service from "../Services/subkriteriaService.js";
import mSubService from "../Services/matrix/mSubService.js";

class router extends base {
    constructor() {
        super("subkriteria");

        this.method = {
            get: [
                ["/", service.main],
                ["/kriteria/:id(\\d+)", service.kriteria],
                ["/:id(\\d+)", service.show_sub],
                ["/:id(\\d+)/hapus", service.hapus_sub],
                ["/matriks/:id(\\d+)", mSubService.main],
                ["/matriks/:id(\\d+)/table", mSubService.getTable],
                ["/matriks/:idParent(\\d+)/update/:id(\\d+)", mSubService.update]
            ],
            post: [
                ["/tambah", service.tambah_sub],
                ["/:id(\\d+)/ubah", service.edit_sub],
            ],
        }
    }
}

export default new router();
