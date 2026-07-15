import { axiosApi } from "./api";

export const getAllUsers = async () => {
    const { data } = await axiosApi.get("/users");
    return { users: data };
}

export const updateUser = async (id, data) => {
    return await axiosApi.put(`/users/${id}`, data);
};

export const deleteUser = async (id) => {
    return await axiosApi.delete(`/users/${id}`);
};
