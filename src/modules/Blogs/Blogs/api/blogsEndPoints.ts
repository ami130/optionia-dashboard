import api from "../../../../app/api/api";
import { FilterTypes } from "../../../../app/features/filterSlice";
import { ApiResponse, PaginatedResponse } from "../../../../app/utils/constant";
import { handleOnQueryStarted } from "../../../../app/utils/onQueryStartedHandler";
import { TagTypes } from "../../../../app/utils/tagTypes";
import { IBlog } from "../types/blogsType";

const blogsEndpoint = api.injectEndpoints({
  endpoints: (builder) => ({
    getBlog: builder.query<ApiResponse<PaginatedResponse<IBlog>>, FilterTypes>({
      query: (params) => ({
        url: "/pages/blog",
        params,
      }),
      providesTags: [
        {
          type: TagTypes.BLOG,
          id: TagTypes.BLOG + "_ID",
        },
      ],
    }),

    createBlog: builder.mutation<ApiResponse<IBlog>, any>({
      query: (data) => ({
        url: "/blog",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await handleOnQueryStarted(queryFulfilled, dispatch);
      },
      invalidatesTags: [
        {
          type: TagTypes.BLOG,
          id: TagTypes.BLOG + "_ID",
        },
      ],
    }),

    getSingleBlog: builder.query<ApiResponse<any>, any>({
      query: (id) => ({
        url: `/pages/blog/${id}`,
      }),

      providesTags: [
        {
          type: TagTypes.BLOG,
          id: TagTypes.BLOG + "_ID",
        },
      ],
    }),

    deleteBlog: builder.mutation<ApiResponse<IBlog>, { id: any }>({
      query: ({ id }) => ({
        url: `/blog/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        {
          type: TagTypes.BLOG,
          id: TagTypes.BLOG + "_ID",
        },
      ],
    }),

    updateBlog: builder.mutation<
      ApiResponse<IBlog>,
      { id: number | undefined; data: any }
    >({
      query: ({ id, data }) => ({
        url: `/blog/${id}`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await handleOnQueryStarted(queryFulfilled, dispatch);
      },
      invalidatesTags: [
        {
          type: TagTypes.BLOG,
          id: TagTypes.BLOG + "_ID",
        },
      ],
    }),
  }),
});

export const {
  useCreateBlogMutation,
  useDeleteBlogMutation,
  useGetBlogQuery,
  useGetSingleBlogQuery,
  useUpdateBlogMutation,
} = blogsEndpoint;
