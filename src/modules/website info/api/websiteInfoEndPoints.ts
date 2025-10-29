import api from "../../../app/api/api";
import { FilterTypes } from "../../../app/features/filterSlice";
import { ApiResponse, PaginatedResponse } from "../../../app/utils/constant";
import { handleOnQueryStarted } from "../../../app/utils/onQueryStartedHandler";
import { TagTypes } from "../../../app/utils/tagTypes";
import { IWebsiteInfo } from "../types/websiteInfoType";

const websiteInfoEndpoint = api.injectEndpoints({
  endpoints: (builder) => ({
    getWebsiteInfo: builder.query<
      ApiResponse<PaginatedResponse<IWebsiteInfo>>,
      FilterTypes
    >({
      query: (params) => ({
        url: "/website-data",
        params,
      }),
      providesTags: [
        {
          type: TagTypes.WEBSITE_INFO,
          id: TagTypes.WEBSITE_INFO + "_ID",
        },
      ],
    }),

    updateWebsiteInfo: builder.mutation<
      ApiResponse<IWebsiteInfo>,
      { id: number | undefined; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/website-data/${id}/`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await handleOnQueryStarted(queryFulfilled, dispatch);
      },
      invalidatesTags: [
        {
          type: TagTypes.WEBSITE_INFO,
          id: TagTypes.WEBSITE_INFO + "_ID",
        },
      ],
    }),
  }),
});

export const { useGetWebsiteInfoQuery, useUpdateWebsiteInfoMutation } =
  websiteInfoEndpoint;
