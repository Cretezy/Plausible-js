export type Period = "12mo" | "6mo" | "month" | "30d" | "7d" | "day";
export type Interval = "date" | "month";

export type Property =
  | "event:name"
  | "event:page"
  | "visit:source"
  | "visit:referrer"
  | "visit:utm_medium"
  | "visit:utm_source"
  | "visit:utm_campaign"
  | "visit:device"
  | "visit:browser"
  | "visit:browser_version"
  | "visit:os"
  | "visit:os_version"
  | "visit:country";

export type Metrics =
  | "visitors"
  | "pageviews"
  | "bounce_rate"
  | "visit_duration";

export type AggregatedReturns = Array<{
  value: number;
  change?: number;
}>;

export type DatapointReturns = Array<{
  date: string;
  visitors: number;
}>;

type BreakdownReturns<T extends string> = { [key in T]: string } & {
  visitors: number;
};

export type BreakdownReturn<T extends Property> = T extends
  `${infer _}:${infer Key}` ? BreakdownReturns<Key> : never;