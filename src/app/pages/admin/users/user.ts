export interface UserItem {
   _id: string;
   firstName: string;
   lastName: string;
   email: string;
   phone?: string;
   role: "user" | "admin";
   createdAt: string;
   isActive: boolean;
}

export interface UsersResponse {
   users: UserItem[];
   total: number;
   page: number;
   totalPages: number;
}

export interface CreateUserForm {
   firstName: string;
   lastName: string;
   email: string;
   password: string;
   phone?: string;
   role: "user" | "admin";
   gender: string;
   dateOfBirth: string;
}

export interface UpdateUserForm {
   firstName: string;
   lastName: string;
   email: string;
   phone?: string;
   role: "user" | "admin";
}

export const defaultCreateUserForm: CreateUserForm = {
   firstName: "",
   lastName: "",
   email: "",
   password: "",
   phone: "",
   role: "user",
   gender: "",
   dateOfBirth: "",
};

export const defaultUpdateUserForm: UpdateUserForm = {
   firstName: "",
   lastName: "",
   email: "",
   phone: "",
   role: "user",
};
