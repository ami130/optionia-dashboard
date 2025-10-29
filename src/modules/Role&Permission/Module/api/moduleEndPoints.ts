import api from "../../../../app/api/api";
import { FilterTypes } from "../../../../app/features/filterSlice";
import { ApiResponse, PaginatedResponse } from "../../../../app/utils/constant";
import { handleOnQueryStarted } from "../../../../app/utils/onQueryStartedHandler";
import { TagTypes } from "../../../../app/utils/tagTypes";
import { IModules } from "../types/moduleType";

const moduleEndpoint = api.injectEndpoints({
  endpoints: (builder) => ({
    getModule: builder.query<
      ApiResponse<PaginatedResponse<IModules>>,
      FilterTypes
    >({
      query: (params) => ({
        url: "/modules",
        params,
      }),
      providesTags: [
        {
          type: TagTypes.MODULE,
          id: TagTypes.MODULE + "_ID",
        },
      ],
    }),

    createModule: builder.mutation<ApiResponse<IModules>, FormData>({
      query: (data) => ({
        url: "/modules",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await handleOnQueryStarted(queryFulfilled, dispatch);
      },
      invalidatesTags: [
        {
          type: TagTypes.MODULE,
          id: TagTypes.MODULE + "_ID",
        },
      ],
    }),

    getSingleModule: builder.query<ApiResponse<any>, number>({
      query: (id) => ({
        url: `/modules/${id}/`,
      }),

      providesTags: [
        {
          type: TagTypes.MODULE,
          id: TagTypes.MODULE + "_ID",
        },
      ],
    }),

    deleteModule: builder.mutation<ApiResponse<IModules>, { id: any }>({
      query: ({ id }) => ({
        url: `/modules/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: [
        {
          type: TagTypes.MODULE,
          id: TagTypes.MODULE + "_ID",
        },
      ],
    }),

    updateModule: builder.mutation<
      ApiResponse<IModules>,
      { id: number | undefined; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/modules/${id}/`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await handleOnQueryStarted(queryFulfilled, dispatch);
      },
      invalidatesTags: [
        {
          type: TagTypes.MODULE,
          id: TagTypes.MODULE + "_ID",
        },
      ],
    }),
  }),
});

export const {
  useGetModuleQuery,
  useUpdateModuleMutation,
  useCreateModuleMutation,
  useDeleteModuleMutation,
  useGetSingleModuleQuery
} = moduleEndpoint;
