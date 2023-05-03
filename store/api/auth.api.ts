import { RootState } from "../store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearUser, setAuth, setUser } from "../slices/user.slice";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

//const API_URL = "192.168.100.9:7000";
const API_URL = "192.168.194.72:7000";

const baseQuery = fetchBaseQuery({
  baseUrl: `http://${API_URL}/api`,
  prepareHeaders(headers, { getState, endpoint }) {
    const userData = (getState() as RootState).userReducer;
    // const token = localStorage.getItem("token");

    // if (userData.isAuth && token && endpoint !== "refresh") {
    //   headers.set("Authorization", `Bearer ${token}`);
    // }

    return headers;
  },
  credentials: "include",
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {

    const refreshResult: any = await baseQuery("/refresh", api, extraOptions);
    // store the new token
    if (refreshResult.error && result.error.status === 401) {      
      result = await baseQuery(
        {
          url: "/logout",
          method: "POST",
          credentials: "include",
        },
        api,
        extraOptions
      );
      
      api.dispatch(clearUser());
      return result;
    }

    if(!refreshResult.error) {

      //localStorage.setItem("token", refreshResult.data?.accessToken);
      // retry the initial query
      result = await baseQuery(args, api, extraOptions);
    }

  }
  return result;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,

  endpoints: (build) => ({
    test: build.mutation({
        query: (body) => ({
            url: '/routes',
            method: 'POST',
            body
        })
    }),

    getAllRoutes: build.query({
      query: () => ({
        url: '/routes'
      })
    })
  }),
});

export const {
  useTestMutation,
  useGetAllRoutesQuery,
} = authApi;
