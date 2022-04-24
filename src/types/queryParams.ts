import { CountryCode, MonthName, Category } from "./foodItem";

export interface QueryParams {
  country?: CountryCode;
  month?: MonthName;
  categories?: Category[];
  region?: string;
  searchTerm?: string;
  showOnlyNative?: boolean;
  beta?: boolean;
}
