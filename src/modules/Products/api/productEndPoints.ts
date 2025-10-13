import api from "../../../app/api/api";
import { FilterTypes } from "../../../app/features/filterSlice";
import { ApiResponse, PaginatedResponse } from "../../../app/utils/constant";
import { handleOnQueryStarted } from "../../../app/utils/onQueryStartedHandler";
import { TagTypes } from "../../../app/utils/tagTypes";
import { ICreateProduct, IProducts } from "../types/productsType";

const productsEndpoint = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      ApiResponse<PaginatedResponse<IProducts>>,
      FilterTypes
    >({
      query: (params) => ({
        url: "/api/v1.0/products/",
        params,
      }),
      providesTags: [
        {
          type: TagTypes.PRODUCTS,
          id: TagTypes.PRODUCTS + "_ID",
        },
      ],
    }),

    createProduct: builder.mutation<ApiResponse<ICreateProduct>, FormData>({
      query: (data) => ({
        url: "/api/v1.0/products/",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await handleOnQueryStarted(queryFulfilled, dispatch);
      },
      invalidatesTags: [
        {
          type: TagTypes.PRODUCTS,
          id: TagTypes.PRODUCTS + "_ID",
        },
      ],
    }),

    getSingleProduct: builder.query<ApiResponse<any>, number>({
      query: (studId) => ({
        url: `/api/v1.0/products/${studId}/`,
      }),

      providesTags: [
        {
          type: TagTypes.PRODUCTS,
          id: TagTypes.PRODUCTS + "_ID",
        },
      ],
    }),

    deleteProduct: builder.mutation<ApiResponse<IProducts>, { id: any }>({
      query: ({ id }) => ({
        url: `/api/v1.0/products/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: [
        {
          type: TagTypes.PRODUCTS,
          id: TagTypes.PRODUCTS + "_ID",
        },
        {
          type: TagTypes.ADMISSION,
          id: TagTypes.ADMISSION + "_ID",
        },
      ],
    }),

    updateProduct: builder.mutation<
      ApiResponse<IProducts>,
      { id: number | undefined; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/api/v1.0/products/${id}/`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await handleOnQueryStarted(queryFulfilled, dispatch);
      },
      invalidatesTags: [
        {
          type: TagTypes.PRODUCTS,
          id: TagTypes.PRODUCTS + "_ID",
        },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useGetSingleProductQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsEndpoint;
