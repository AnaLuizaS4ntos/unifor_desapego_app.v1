import api from "./api";

export function getProducts() {
    return api.get("/products/");
}