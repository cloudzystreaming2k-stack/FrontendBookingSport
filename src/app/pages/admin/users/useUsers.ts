import { useCallback, useEffect, useState } from "react";
import { userService } from "./user.service";
import { UserItem, UsersResponse } from "./user";

export function useUsers(initialPage = 1, limit = 10) {
   const [users, setUsers] = useState<UserItem[]>([]);
   const [total, setTotal] = useState(0);
   const [totalPages, setTotalPages] = useState(1);
   const [isLoading, setIsLoading] = useState(false);

   const fetchUsers = useCallback(async (page = initialPage, search = "", role = "all") => {
      setIsLoading(true);
      try {
         const params: Record<string, string> = { page: String(page), limit: String(limit) };
         if (search) params.search = search;
         if (role !== "all") params.role = role;

         const data: UsersResponse = await userService.getUsers(params);
         setUsers(data.users);
         setTotal(data.total);
         setTotalPages(data.totalPages);
      } finally {
         setIsLoading(false);
      }
   }, [initialPage, limit]);

   useEffect(() => { fetchUsers(); }, [fetchUsers]);

   return { users, total, totalPages, isLoading, fetchUsers, setUsers, setTotal };
}
