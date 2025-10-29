import api from "../../../app/api/api";
import { ApiResponse } from "../../../app/utils/constant";
import {
  ForgotPasswordTypes,
  LoginResponse,
  LoginTypes,
} from "../types/authTypes";

const loginEndpoint = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<LoginResponse>, LoginTypes>({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Login", id: "LOGIN_ID" }],
    }),
    sendOtp: builder.mutation<ApiResponse<any>, { email: string }>({
      query: (data) => ({
        url: "/auth/send-email-otp",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Profile", id: "OTP" }],
    }),

    verifyOtp: builder.mutation<
      ApiResponse<any>,
      { email: string | null; otp: number }
    >({
      query: (data) => ({
        url: "/auth/verify-email-otp",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Profile", id: "OTP" }],
    }),
    changePassword: builder.mutation<ApiResponse<any>, ForgotPasswordTypes>({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Profile", id: "OTP" }],
    }),
  }),
});

export const {
  useLoginMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useChangePasswordMutation,
} = loginEndpoint;
