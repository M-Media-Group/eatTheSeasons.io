import { FoodItem } from "@/types/foodItem";

export function getTimeInMillis(timeRange: string): number {
  const timeUnits = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    w: 7 * 24 * 60 * 60 * 1000,
    M: 30 * 24 * 60 * 60 * 1000,
    y: 365 * 24 * 60 * 60 * 1000,
  };
  const value = parseInt(timeRange);
  const unit = timeRange.charAt(timeRange.length - 1) as keyof typeof timeUnits;

  return value * timeUnits[unit];
}

export function getDatePrecision(timeRange: string): string {
  const timeUnits = {
    s: "second",
    m: "minute",
    h: "hour",
    d: "day",
    w: "week",
    M: "month",
    y: "year",
  };
  const unit = timeRange.charAt(timeRange.length - 1) as keyof typeof timeUnits;

  return timeUnits[unit];
}

export function applyDatePrecision(date: Date, precision: string): number {
  const datePrecision = {
    // Hour should apply the same hour regardless of day, month, year
    second: date.getSeconds(),
    minute: date.getMinutes(),
    hour: date.getHours(),
    day: date.getDay(),
    week: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  };

  return datePrecision[precision as keyof typeof datePrecision];
}

export function neoGroupByTimeRangeAndDate(
  foodItems: FoodItem[],
  timeRange: string
): Record<string, FoodItem[]> {
  const breakdown = {} as Record<number, FoodItem[]>;
  const itemDatePrecision = getDatePrecision(timeRange);

  foodItems.forEach((item) => {
    const itemDate = new Date(item.created_at);
    const itemDateWithPrecision = applyDatePrecision(
      itemDate,
      itemDatePrecision
    );

    //   Use the formatted date with its precision as the key
    const key = itemDateWithPrecision;
    if (!breakdown[key]) {
      breakdown[key] = [];
    }
    breakdown[key].push(item);
  });

  return breakdown;
}

export function filterToTimerange(
  foodItems: FoodItem[],
  startTime: number,
  timeRange: string
): FoodItem[] {
  const filteredItems = foodItems.filter((item) => {
    const itemDate = new Date(item.created_at).getTime();
    const timeDiffInMillis = startTime - itemDate;
    return timeDiffInMillis <= getTimeInMillis(timeRange);
  });

  return filteredItems;
}
