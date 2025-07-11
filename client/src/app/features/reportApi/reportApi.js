import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const reportApi = createApi({
  reducerPath: "reportApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
    credentials: "include",
  }),
  tagTypes: ["productReports"],
  endpoints: (builder) => ({
    getProductReport: builder.query({
      query: () => "/productReport",
      providesTags: ["productReports"],
    }),
    getDashboardStats: builder.query({
      query: () => "/getDashboardStats",
      providesTags: ["productReports"],
    }),
    getMonthlySales: builder.query({
      query: () => "/getMonthlySales",
      providesTags: ["productReports"],
    }),
    getMonthlyTarget: builder.query({
      query: () => "/getMonthlyTarget",
      providesTags: ["productReports"],
    }),
  }),
});

export const {
  useGetProductReportQuery,
  useGetDashboardStatsQuery,
  useGetMonthlySalesQuery,
  useGetMonthlyTargetQuery,
} = reportApi;

export default reportApi;
