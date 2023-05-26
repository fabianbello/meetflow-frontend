export interface AuthResponse {
    ok: boolean;
    uid?: string;
    name?: string;
    email?: string;
    token?: string;
    msg?: string;
    active?: boolean;
}

export interface Usuario {
    uid: string;
    name: string;
    email?: string;
}