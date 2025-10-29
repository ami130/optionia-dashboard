import { TagTypes } from "./../../../app/utils/tagTypes";

import api from "../../../app/api/api";
import { FilterTypes } from "../../../app/features/filterSlice";
import { ApiResponse, PaginatedResponse } from "../../../app/utils/constant";
import { IUSer } from "../types/userType";
import { IUser } from "../../settings/role & permission/type/rolePermissionTypes";
import { handleOnQueryStarted } from "../../../app/utils/onQueryStartedHandler";

const userEndpoint = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<ApiResponse<PaginatedResponse<IUSer>>, FilterTypes>(
      {
        query: (params) => ({
          url: "/users",
          params,
        }),
        providesTags: [
          {
            type: TagTypes.USER,
            id: TagTypes.USER + "_ID",
          },
        ],
      }
    ),

    createUser: builder.mutation<ApiResponse<IUser>, FormData>({
      query: (data) => ({
        url: "/auth/signup",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await handleOnQueryStarted(queryFulfilled, dispatch);
      },
      invalidatesTags: [
        {
          type: TagTypes.USER,
          id: TagTypes.USER + "_ID",
        },
      ],
    }),

    // getSingleUser: builder.query<ApiResponse<any>, number>({
    //   query: (id) => ({
    //     url: `/modules/${id}/`,
    //   }),

    //   providesTags: [
    //     {
    //       type: TagTypes.USER,
    //       id: TagTypes.USER + "_ID",
    //     },
    //   ],
    // }),

    // deleteModule: builder.mutation<ApiResponse<IUser>, { id: any }>({
    //   query: ({ id }) => ({
    //     url: `/modules/${id}/`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: [
    //     {
    //       type: TagTypes.USER,
    //       id: TagTypes.USER + "_ID",
    //     },
    //   ],
    // }),

    updateUser: builder.mutation<
      ApiResponse<IUser>,
      { id: number | undefined; data: any }
    >({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await handleOnQueryStarted(queryFulfilled, dispatch);
      },
      invalidatesTags: [
        {
          type: TagTypes.USER,
          id: TagTypes.USER + "_ID",
        },
      ],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} = userEndpoint;
