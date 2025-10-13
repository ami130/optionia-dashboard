import api from "../../../app/api/api";
import { FilterTypes } from "../../../app/features/filterSlice";
import { ApiResponse, PaginatedResponse } from "../../../app/utils/constant";
import { handleOnQueryStarted } from "../../../app/utils/onQueryStartedHandler";
import { TagTypes } from "../../../app/utils/tagTypes";
import {
  ICreateProfileSetting,
  IProfileSetting,
} from "../types/profileSettingType";

const profileSettingEndpoint = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfileSetting: builder.query<
      ApiResponse<PaginatedResponse<IProfileSetting>>,
      FilterTypes
    >({
      query: (params) => ({
        url: "/api/v1.0/profileSetting/",
        params,
      }),
      providesTags: [
        {
          type: TagTypes.PROFILE_SETTING,
          id: TagTypes.PROFILE_SETTING + "_ID",
        },
      ],
    }),

    createProfileSetting: builder.mutation<
      ApiResponse<ICreateProfileSetting>,
      FormData
    >({
      query: (data) => ({
        url: "/api/v1.0/profileSetting/",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await handleOnQueryStarted(queryFulfilled, dispatch);
      },
      invalidatesTags: [
        {
          type: TagTypes.PROFILE_SETTING,
          id: TagTypes.PROFILE_SETTING + "_ID",
        },
      ],
    }),

    getSingleProfileSetting: builder.query<ApiResponse<any>, number>({
      query: (studId) => ({
        url: `/api/v1.0/profileSetting/${studId}/`,
      }),

      providesTags: [
        {
          type: TagTypes.PROFILE_SETTING,
          id: TagTypes.PROFILE_SETTING + "_ID",
        },
      ],
    }),

    deleteProfileSetting: builder.mutation<
      ApiResponse<IProfileSetting>,
      { id: any }
    >({
      query: ({ id }) => ({
        url: `/api/v1.0/profileSetting/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: [
        {
          type: TagTypes.PROFILE_SETTING,
          id: TagTypes.PROFILE_SETTING + "_ID",
        },
        {
          type: TagTypes.ADMISSION,
          id: TagTypes.ADMISSION + "_ID",
        },
      ],
    }),

    updateProfileSetting: builder.mutation<
      ApiResponse<IProfileSetting>,
      { id: number | undefined; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/api/v1.0/profileSetting/${id}/`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await handleOnQueryStarted(queryFulfilled, dispatch);
      },
      invalidatesTags: [
        {
          type: TagTypes.PROFILE_SETTING,
          id: TagTypes.PROFILE_SETTING + "_ID",
        },
      ],
    }),
  }),
});

export const {
  useGetProfileSettingQuery,
  useCreateProfileSettingMutation,
  useGetSingleProfileSettingQuery,
  useUpdateProfileSettingMutation,
  useDeleteProfileSettingMutation,
} = profileSettingEndpoint;
