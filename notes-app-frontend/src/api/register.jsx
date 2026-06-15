import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_AUTH_URL;

export const registerApi = createApi({
    reducerPath: "registerApi",
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (data) => ({
                url: "/auth/register/",
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const { useRegisterMutation } = registerApi;