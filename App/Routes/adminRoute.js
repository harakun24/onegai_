
import base from "./baseRoute.js";
import service from "../Services/adminService.js";
import component from "../Services/Components/userComponentService.js"

class router extends base {
    constructor() {
        super("panel-admin");

        this.method = {
            get: [
                ["/", service.main],
                ["/user/:id(\\d+)", service.show_user],
                ["/user/:id(\\d+)/hapus", service.hapus_user],

                // components route
                ["/user/all", component.get_table],
                ["/user/keluar", service.keluar],


            ],
            post: [
                ["/user/tambah", service.tambah_user],
                ["/user/:id(\\d+)/ubah", service.edit_user],
            ]
        }
    }
}

export default new router();
