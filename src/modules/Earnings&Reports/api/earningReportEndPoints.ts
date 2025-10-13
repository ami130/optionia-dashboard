import api from "../../../app/api/api";
import { FilterTypes } from "../../../app/features/filterSlice";
import { ApiResponse, PaginatedResponse } from "../../../app/utils/constant";
import { handleOnQueryStarted } from "../../../app/utils/onQueryStartedHandler";
import { TagTypes } from "../../../app/utils/tagTypes";
import { ICreateEarningReport, IEarningReport } from "../types/earningReportType";

const earningReportEndpoint = api.injectEndpoints({
  endpoints: (builder) => ({
    getEarningReport: builder.query<
      ApiResponse<PaginatedResponse<IEarningReport>>,
      FilterTypes
    >({
      query: (params) => ({
        url: "/api/v1.0/earningReport/",
        params,
      }),
      providesTags: [
        {
          type: TagTypes.EARNING_REPORT,
          id: TagTypes.EARNING_REPORT + "_ID",
        },
      ],
    }),

    createEarningReport: builder.mutation<ApiResponse<ICreateEarningReport>, FormData>({
      query: (data) => ({
        url: "/api/v1.0/earningReport/",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await handleOnQueryStarted(queryFulfilled, dispatch);
      },
      invalidatesTags: [
        {
          type: TagTypes.EARNING_REPORT,
          id: TagTypes.EARNING_REPORT + "_ID",
        },
      ],
    }),

    getSingleEarningReport: builder.query<ApiResponse<any>, number>({
      query: (studId) => ({
        url: `/api/v1.0/earningReport/${studId}/`,
      }),

      providesTags: [
        {
          type: TagTypes.EARNING_REPORT,
          id: TagTypes.EARNING_REPORT + "_ID",
        },
      ],
    }),

    deleteEarningReport: builder.mutation<ApiResponse<IEarningReport>, { id: any }>({
      query: ({ id }) => ({
        url: `/api/v1.0/earningReport/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: [
        {
          type: TagTypes.EARNING_REPORT,
          id: TagTypes.EARNING_REPORT + "_ID",
        },
        {
          type: TagTypes.ADMISSION,
          id: TagTypes.ADMISSION + "_ID",
        },
      ],
    }),

    updateEarningReport: builder.mutation<
      ApiResponse<IEarningReport>,
      { id: number | undefined; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/api/v1.0/earningReport/${id}/`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await handleOnQueryStarted(queryFulfilled, dispatch);
      },
      invalidatesTags: [
        {
          type: TagTypes.EARNING_REPORT,
          id: TagTypes.EARNING_REPORT + "_ID",
        },
      ],
    }),
  }),
});

export const {
  useGetEarningReportQuery,
  useCreateEarningReportMutation,
  useGetSingleEarningReportQuery,
  useUpdateEarningReportMutation,
  useDeleteEarningReportMutation,
} = earningReportEndpoint;
