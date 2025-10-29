import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { TOKEN_NAME, baseUrl } from "../../utilities/baseQuery";
import { loggedOut } from "../features/authSlice";
import { TagTypes } from "../utils/tagTypes";

interface EnhancedFetchArgs extends FetchArgs {
  token?: string;
}

const baseQuery: BaseQueryFn<
  string | EnhancedFetchArgs,
  unknown,
  FetchBaseQueryError
> = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.access;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const api = createApi({
  reducerPath: "main-api",
  baseQuery: async (args: string | EnhancedFetchArgs, api, extraOptions) => {
    const response = await baseQuery(args, api, extraOptions);

    const errorStatus = [
      401,
      // 403,
      // "CUSTOM_ERROR",
      // "FETCH_ERROR",
      // "PARSING_ERROR",
      "TIMEOUT_ERROR",
    ];

    if (response.error && errorStatus.includes(response.error?.status)) {
      api.dispatch(loggedOut());
      localStorage.removeItem(TOKEN_NAME);
    }

    return response;
  },

  tagTypes: Object.values(TagTypes),
  endpoints: () => ({}),
});

export default api;
