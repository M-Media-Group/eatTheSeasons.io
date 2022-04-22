import { Country, Month, Category } from "./foodItem";

export interface QueryParams {
  country?: Country;
  month?: Month;
  categories?: Category[];
  region?: string;
  searchTerm?: string;
  showOnlyNative?: boolean;
  beta?: boolean;
}
