export interface FoodItem {
  imgUrl: string;
  name: string;
  categories: Category[];
  availability: Availability[];
}

export interface Availability {
  country: Country;
  localFoodItemName: string;
  regions: Region[];
}

export enum Country {
  Fr = "fr",
  Pl = "pl",
}

export interface Region {
  name: Name;
  months: Month[];
  isNative: boolean;
  sourceUrl?: string;
}

export enum Name {
  All = "All",
}

export enum Month {
  January = "January",
  February = "February",
  March = "March",
  April = "April",
  May = "May",
  June = "June",
  July = "July",
  August = "August",
  September = "September",
  October = "October",
  November = "November",
  December = "December",
}

export enum Category {
  Bean = "Bean",
  Fruit = "Fruit",
  Vegetable = "Vegetable",
}
