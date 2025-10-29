import api from "../../../app/api/api";
import { ApiResponse } from "../../../app/utils/constant";
import { TagTypes } from "../../../app/utils/tagTypes";

const profileEndpoint = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<ApiResponse<any>, void>({
      query: () => ({
        url: "/users/me",
      }),
      providesTags: [{ type: TagTypes.PROFILE, id: TagTypes.PROFILE + "_ID" }],
    }),

    updateProfile: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: "/auth/users/me/",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [
        { type: TagTypes.PROFILE, id: TagTypes.PROFILE + "_ID" },
      ],
    }),
    changePassword: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: "/auth/users/set_password/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        { type: TagTypes.PROFILE, id: TagTypes.PROFILE + "_ID" },
      ],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = profileEndpoint;
