import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_AUTH_URL;

export const noteApi = createApi({
    reducerPath: "noteApi",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.user?.token;  // ✅ fixed - token is inside user
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getNotes: builder.query({
            query: (search = "") => `/notes/?search=${search}`,
        }),
        createNote: builder.mutation({
            query: (data) => ({
                url: "/notes/",
                method: "POST",
                body: data,
            }),
        }),
        updateNote: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/notes/${id}/`,
                method: "PATCH",
                body: data,
            }),
        }),
        deleteNote: builder.mutation({
            query: (id) => ({
                url: `/notes/${id}/`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetNotesQuery,
    useCreateNoteMutation,
    useUpdateNoteMutation,
    useDeleteNoteMutation,
} = noteApi;