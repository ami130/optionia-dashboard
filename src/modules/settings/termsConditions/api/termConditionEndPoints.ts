import api from "../../../../app/api/api";
import { FilterTypes } from "../../../../app/features/filterSlice";
import { ApiResponse } from "../../../../app/utils/constant";
import { handleOnQueryStarted } from "../../../../app/utils/onQueryStartedHandler";
import { TagTypes } from "../../../../app/utils/tagTypes";
import { IGetTermCondition } from "../type/termConditionTypes";

const termConditionEndPoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getTermCondition: builder.query<
      ApiResponse<IGetTermCondition[]>,
      FilterTypes
    >({
      query: (params) => ({
        url: "/terms-of-service",
        params,
      }),
      providesTags: [
        {
          type: TagTypes.TERM_CONDITIONS,
          id: TagTypes.TERM_CONDITIONS + "_ID",
        },
      ],
    }),

    createTermCondition: builder.mutation<ApiResponse<any>, FormData>({
      query: (data) => ({
        url: "/terms-of-service",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await handleOnQueryStarted(queryFulfilled, dispatch);
      },
      invalidatesTags: [
        {
          type: TagTypes.TERM_CONDITIONS,
          id: TagTypes.TERM_CONDITIONS + "_ID",
        },
      ],
    }),

    getSingleTerm: builder.query<ApiResponse<IGetTermCondition>, number>({
      query: (roleId) => ({
        url: `/terms-of-service/${roleId}`,
      }),

      providesTags: [
        {
          type: TagTypes.TERM_CONDITIONS,
          id: TagTypes.TERM_CONDITIONS + "_ID",
        },
      ],
    }),

    updateTermCondition: builder.mutation<
      ApiResponse<IGetTermCondition>,
      { id: number | undefined; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/terms-of-service/${id}`,
        method: "PUT",
        body: data,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await handleOnQueryStarted(queryFulfilled, dispatch);
      },
      invalidatesTags: [
        {
          type: TagTypes.TERM_CONDITIONS,
          id: TagTypes.TERM_CONDITIONS + "_ID",
        },
      ],
    }),
  }),
});

export const {
  useCreateTermConditionMutation,
  useGetSingleTermQuery,
  useGetTermConditionQuery,
  useUpdateTermConditionMutation,
} = termConditionEndPoints;
