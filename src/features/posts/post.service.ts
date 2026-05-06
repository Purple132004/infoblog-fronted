import { http } from '@/lib/http';

export class PostService {
    static async list() {
        return http.get('http://localhost:3000/posts?page=1&perPage=2');
    }
}