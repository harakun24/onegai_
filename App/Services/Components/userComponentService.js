
import base from "../baseService.js";

const { view, db } = base
class service extends base {
    constructor() {
        super("userComponent")
    }
    async get_table(req, res) {
        const list_user = await db.User.findMany();
        res.send(view.render("./component/user-table", { list_user }))
    }
}

export default new service();
