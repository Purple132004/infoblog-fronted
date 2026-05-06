
export type User = {
    role: "admin" | "user";
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    emailVerifiedAt: string | null;
    createdAt: string;
}