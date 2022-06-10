import { User } from "./user";

export class UserParams {
    gender: string;
    minAge = 18;
    maxAge = 100;
    pageNumber = 1;
    pageSize = 6;
    orderBy = 'lastActive';

    constructor(user: User) {
        console.log(user.gender);
        this.gender = (user.gender === 'male')? 'female' : 'male';
    }
}