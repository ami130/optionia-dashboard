import api from "../../../../app/api/api";
import { FilterTypes } from "../../../../app/features/filterSlice";
import { ApiResponse, PaginatedResponse } from "../../../../app/utils/constant";
import { handleOnQueryStarted } from "../../../../app/utils/onQueryStartedHandler";
import { TagTypes } from "../../../../app/utils/tagTypes";
import { ICategories } from "../types/categoriesType";

const categoriesEndpoint = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<
      ApiResponse<PaginatedResponse<ICategories>>,
      FilterTypes
    >({
      query: (params) => ({
        url: "/categories",
        params,
      }),
      providesTags: [
        {
          type: TagTypes.CATEGORIES,
          id: TagTypes.CATEGORIES + "_ID",
        },
      ],
    }),

    createCategories: builder.mutation<ApiResponse<ICategories>, FormData>({
      query: (data) => ({
        url: "/categories",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await handleOnQueryStarted(queryFulfilled, dispatch);
      },
      invalidatesTags: [
        {
          type: TagTypes.CATEGORIES,
          id: TagTypes.CATEGORIES + "_ID",
        },
      ],
    }),

    getSingleCategories: builder.query<ApiResponse<any>, number>({
      query: (id) => ({
        url: `/categories/${id}`,
      }),

      providesTags: [
        {
          type: TagTypes.CATEGORIES,
          id: TagTypes.CATEGORIES + "_ID",
        },
      ],
    }),

    deleteCategories: builder.mutation<ApiResponse<ICategories>, { id: any }>({
      query: ({ id }) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        {
          type: TagTypes.CATEGORIES,
          id: TagTypes.CATEGORIES + "_ID",
        },
      ],
    }),

    updateCategories: builder.mutation<
      ApiResponse<ICategories>,
      { id: number | undefined; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body: data,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await handleOnQueryStarted(queryFulfilled, dispatch);
      },
      invalidatesTags: [
        {
          type: TagTypes.CATEGORIES,
          id: TagTypes.CATEGORIES + "_ID",
        },
      ],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoriesMutation,
  useDeleteCategoriesMutation,
  useGetSingleCategoriesQuery,
  useUpdateCategoriesMutation,
} = categoriesEndpoint;
