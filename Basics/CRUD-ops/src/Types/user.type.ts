export interface User {
    userid: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
}

export interface NewUser {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
}

// update user type
export interface UpdateUser {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
}


