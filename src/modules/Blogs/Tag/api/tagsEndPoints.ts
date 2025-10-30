import api from "../../../../app/api/api";
import { FilterTypes } from "../../../../app/features/filterSlice";
import { ApiResponse, PaginatedResponse } from "../../../../app/utils/constant";
import { handleOnQueryStarted } from "../../../../app/utils/onQueryStartedHandler";
import { TagTypes } from "../../../../app/utils/tagTypes";
import { ITags } from "../types/tagsType";

const tagsEndpoint = api.injectEndpoints({
  endpoints: (builder) => ({
    getTags: builder.query<ApiResponse<PaginatedResponse<ITags>>, FilterTypes>({
      query: (params) => ({
        url: "/tags",
        params,
      }),
      providesTags: [
        {
          type: TagTypes.TAG,
          id: TagTypes.TAG + "_ID",
        },
      ],
    }),

    createTags: builder.mutation<ApiResponse<ITags>, any>({
      query: (data) => ({
        url: "/tags",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await handleOnQueryStarted(queryFulfilled, dispatch);
      },
      invalidatesTags: [
        {
          type: TagTypes.TAG,
          id: TagTypes.TAG + "_ID",
        },
      ],
    }),

    getSingleTags: builder.query<ApiResponse<any>, number>({
      query: (id) => ({
        url: `/tags/${id}`,
      }),

      providesTags: [
        {
          type: TagTypes.TAG,
          id: TagTypes.TAG + "_ID",
        },
      ],
    }),

    deleteTags: builder.mutation<ApiResponse<ITags>, { id: any }>({
      query: ({ id }) => ({
        url: `/tags/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        {
          type: TagTypes.TAG,
          id: TagTypes.TAG + "_ID",
        },
      ],
    }),

    updateTags: builder.mutation<
      ApiResponse<ITags>,
      { id: number | undefined; data: any }
    >({
      query: ({ id, data }) => ({
        url: `/tags/${id}`,
        method: "PUT",
        body: data,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await handleOnQueryStarted(queryFulfilled, dispatch);
      },
      invalidatesTags: [
        {
          type: TagTypes.TAG,
          id: TagTypes.TAG + "_ID",
        },
      ],
    }),
  }),
});

export const {
  useCreateTagsMutation,
  useDeleteTagsMutation,
  useGetSingleTagsQuery,
  useGetTagsQuery,
  useUpdateTagsMutation,
} = tagsEndpoint;
