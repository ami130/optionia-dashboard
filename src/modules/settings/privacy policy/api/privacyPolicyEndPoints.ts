import api from "../../../../app/api/api";
import { FilterTypes } from "../../../../app/features/filterSlice";
import { ApiResponse } from "../../../../app/utils/constant";
import { handleOnQueryStarted } from "../../../../app/utils/onQueryStartedHandler";
import { TagTypes } from "../../../../app/utils/tagTypes";
import { IGetPrivacyPolicy } from "../type/privacyPolicyTypes";

const privacyPolicyEndPoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getPrivacyPolicy: builder.query<
      ApiResponse<IGetPrivacyPolicy[]>,
      FilterTypes
    >({
      query: (params) => ({
        url: "/privacy-policy",
        params,
      }),
      providesTags: [
        {
          type: TagTypes.PRIVACY_POLICY,
          id: TagTypes.PRIVACY_POLICY + "_ID",
        },
      ],
    }),

    getSinglePrivacyPolicy: builder.query<
      ApiResponse<IGetPrivacyPolicy>,
      number
    >({
      query: (id) => ({
        url: `/privacy-policy/${id}`,
      }),

      providesTags: [
        {
          type: TagTypes.PRIVACY_POLICY,
          id: TagTypes.PRIVACY_POLICY + "_ID",
        },
      ],
    }),

    updatePrivacyPolicy: builder.mutation<
      ApiResponse<IGetPrivacyPolicy>,
      { id: number | undefined; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/privacy-policy/${id}`,
        method: "PUT",
        body: data,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await handleOnQueryStarted(queryFulfilled, dispatch);
      },
      invalidatesTags: [
        {
          type: TagTypes.PRIVACY_POLICY,
          id: TagTypes.PRIVACY_POLICY + "_ID",
        },
      ],
    }),
  }),
});

export const {
  useGetPrivacyPolicyQuery,
  useGetSinglePrivacyPolicyQuery,
  useUpdatePrivacyPolicyMutation,
} = privacyPolicyEndPoints;
