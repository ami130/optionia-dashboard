import api from "../../../app/api/api";
import { FilterTypes } from "../../../app/features/filterSlice";
import { ApiResponse, PaginatedResponse } from "../../../app/utils/constant";
import { handleOnQueryStarted } from "../../../app/utils/onQueryStartedHandler";
import { TagTypes } from "../../../app/utils/tagTypes";
import { IPages } from "../types/pagesType";

const pagesEndpoint = api.injectEndpoints({
  endpoints: (builder) => ({
    getPages: builder.query<ApiResponse<PaginatedResponse<any[]>>, FilterTypes>(
      {
        query: (params) => ({
          url: "/pages",
          params,
        }),
        providesTags: [
          {
            type: TagTypes.PAGES,
            id: TagTypes.PAGES + "_ID",
          },
        ],
      }
    ),

    createPages: builder.mutation<ApiResponse<any>, FormData>({
      query: (data) => ({
        url: "/pages",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await handleOnQueryStarted(queryFulfilled, dispatch);
      },
      invalidatesTags: [
        {
          type: TagTypes.PAGES,
          id: TagTypes.PAGES + "_ID",
        },
      ],
    }),

    getSinglePages: builder.query<ApiResponse<any>, number>({
      query: (id) => ({
        url: `/pages/${id}/`,
      }),

      providesTags: [
        {
          type: TagTypes.PAGES,
          id: TagTypes.PAGES + "_ID",
        },
      ],
    }),

    deletePages: builder.mutation<ApiResponse<IPages>, { id: any }>({
      query: ({ id }) => ({
        url: `/pages/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: [
        {
          type: TagTypes.PAGES,
          id: TagTypes.PAGES + "_ID",
        },
      ],
    }),

    updatePages: builder.mutation<
      ApiResponse<IPages>,
      { id: number | undefined; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/pages/${id}/`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await handleOnQueryStarted(queryFulfilled, dispatch);
      },
      invalidatesTags: [
        {
          type: TagTypes.PAGES,
          id: TagTypes.PAGES + "_ID",
        },
      ],
    }),
  }),
});

export const {
  useCreatePagesMutation,
  useDeletePagesMutation,
  useGetPagesQuery,
  useGetSinglePagesQuery,
  useUpdatePagesMutation,
} = pagesEndpoint;
