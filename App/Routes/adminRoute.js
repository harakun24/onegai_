
import base from "./baseRoute.js";
import service from "../Services/adminService.js";
import kriteria from "./kriteriaRoute.js";
import divisi from "./divisiRoute.js";
import visitor from "./visitorRoute.js";
import subkriteria from "./subkriteriaRoute.js";
import tanya from "./tanyaRoute.js";

class router extends base {
    constructor() {
        super("panel-admin");

        this.method = {
            get: [
                ["/", service.main],
                ["/user/:id(\\d+)", service.show_user],
                ["/user/:id(\\d+)/hapus", service.hapus_user],
                ["/user/keluar", service.keluar],
            ],
            post: [
                ["/user/tambah", service.tambah_user],
                ["/user/:id(\\d+)/ubah", service.edit_user],
            ],
            sub: [
                ["/kriteria", kriteria],
                ["/sub", subkriteria],
                ["/divisi", divisi],
                ["/visitor", visitor],
                ["/pertanyaan", tanya],
            ]
        }
    }
}

export default new router();
