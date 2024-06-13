import "colors"
export default class Router {
    path = "/";
    method = {
        get: [],
        post: [],
        put: [],
        delete: [],
        sub: [],
    }
    constructor(route) {
        this.path += route == "/" ? "" : route;
        console.log(` # Route `.yellow + `${this.path}`.brightYellow)
    }
}