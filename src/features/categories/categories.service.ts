import { http } from "@/lib/http";


export class CategoriesService {

    static async list() {
        return http.get('/categories');
    }
}