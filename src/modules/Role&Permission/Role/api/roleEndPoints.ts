import api from "../../../../app/api/api";
import { FilterTypes } from "../../../../app/features/filterSlice";
import { ApiResponse, PaginatedResponse } from "../../../../app/utils/constant";
import { handleOnQueryStarted } from "../../../../app/utils/onQueryStartedHandler";
import { TagTypes } from "../../../../app/utils/tagTypes";
import { IRole } from "../types/roleType";

const roleEndpoint = api.injectEndpoints({
  endpoints: (builder) => ({
    getRole: builder.query<ApiResponse<PaginatedResponse<IRole>>, FilterTypes>({
      query: (params) => ({
        url: "/roles",
        params,
      }),
      providesTags: [
        {
          type: TagTypes.ROLE,
          id: TagTypes.ROLE + "_ID",
        },
      ],
    }),

    createRoleAssignWithPermission: builder.mutation<
      ApiResponse<IRole>,
      any
    >({
      query: (data) => ({
        url: "/roles/create-role-assign-permission",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await handleOnQueryStarted(queryFulfilled, dispatch);
      },
      invalidatesTags: [
        {
          type: TagTypes.ROLE,
          id: TagTypes.ROLE + "_ID",
        },
      ],
    }),

    // getSingleModule: builder.query<ApiResponse<any>, number>({
    //   query: (id) => ({
    //     url: `/modules/${id}/`,
    //   }),

    //   providesTags: [
    //     {
    //       type: TagTypes.MODULE,
    //       id: TagTypes.MODULE + "_ID",
    //     },
    //   ],
    // }),

    // deleteModule: builder.mutation<ApiResponse<IModules>, { id: any }>({
    //   query: ({ id }) => ({
    //     url: `/modules/${id}/`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: [
    //     {
    //       type: TagTypes.MODULE,
    //       id: TagTypes.MODULE + "_ID",
    //     },
    //   ],
    // }),

    // updateModule: builder.mutation<
    //   ApiResponse<IModules>,
    //   { id: number | undefined; data: FormData }
    // >({
    //   query: ({ id, data }) => ({
    //     url: `/modules/${id}/`,
    //     method: "PATCH",
    //     body: data,
    //   }),
    //   async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
    //     await handleOnQueryStarted(queryFulfilled, dispatch);
    //   },
    //   invalidatesTags: [
    //     {
    //       type: TagTypes.MODULE,
    //       id: TagTypes.MODULE + "_ID",
    //     },
    //   ],
    // }),
  }),
});

export const { useGetRoleQuery, useCreateRoleAssignWithPermissionMutation } =
  roleEndpoint;
