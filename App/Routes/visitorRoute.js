
import base from "./baseRoute.js";
import service from "../Services/visitorService.js";
import { body } from "express-validator"

class router extends base {
    constructor() {
        super("visitor");

        this.method = {
            get: [
                ["/", service.main],
                ["/:id(\\d+)", service.show_visitor],
                ["/:id(\\d+)/hapus", service.hapus_visitor],

            ],
            post: [
                ["/tambah", [
                    body("nim").matches(/^\d{2}\.\d{2}\.\d{4}$/).withMessage("format nim salah")
                ], service.tambah_visitor],
                ["/:id(\\d+)/ubah", service.edit_visitor],
            ],
        }
    }
}

export default new router();
