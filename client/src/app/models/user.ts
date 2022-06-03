export interface User {
    username: string;
    token: string;
    photoUrl: string;
    knownAs: string;
    gender: string;
}

export interface UserLogin {
    username: string;
    password: string;
}