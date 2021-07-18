// deno-lint-ignore-file no-explicit-any

import {
  BreakdownReturn,
  DatapointReturns,
  // DatapointReturns,
  AggregatedReturns,
  Interval,
  Metrics,
  Period,
  Property,
} from "./types.ts";

export class PlausibleAPI {
  public url = "https://plausible.hedium.nl";

  private key: string;
  private site: string;

  constructor(key: string, site: string) {
    this.key = key;
    this.site = site;
  }

  private async getAbstract(
    path: string,
    params: URLSearchParams = new URLSearchParams(),
  ): Promise<any> {
    params.append("site_id", this.site);

    const endpoint = `${this.url}/${path}?${params}`;
    const response = await fetch(endpoint, {
      method: `GET`,
      headers: {
        "Authorization": `Bearer ${this.key}`,
        "Content-Type": `application/json`,
      },
    });

    return await response.json();
  }

  /**
   * This function returns the number of current visitors on your site. A current visitor is defined as a visitor who triggered a pageview on your site in the last 5 minutes.
   */

  public getRealtime(): Promise<number> {
    return this.getAbstract(`api/v1/stats/realtime/visitors`);
  }

  /**
   * This function aggregates metrics over a certain time period. If you are familiar with the Plausible dashboard, this function corresponds to the top row of stats that include Unique Visitors, Pageviews, Bounce rate and Visit duration. You can retrieve any number and combination of these metrics in one request.
   */

  public async getAggregate(
    period: Period,
    metrics: Metrics,
    compare?: boolean,
    filters?: string,
  ): Promise<AggregatedReturns> {
    const params = new URLSearchParams();

    params.append(`period`, period);
    params.append(`metrics`, metrics);

    if (compare) params.append(`compare`, "previous_period");
    if (filters) params.append("filters", filters);

    const response = await this.getAbstract(`api/v1/stats/aggregate`, params);

    if (response.results.visitors) return response.results.visitors;
    if (response.results.pageviews) return response.results.pageviews;
    if (response.results.bounce_rate) return response.results.bounce_rate;
    if (response.results.visit_duration) return response.results.visit_duration;
  }

  /**
   * This function provides timeseries data over a certain time period. If you are familiar with the Plausible dashboard, this function corresponds to the main visitor graph.
   */

  public async getTimeseries(
    period: Period,
    metrics?: Metrics,
    filters?: string,
    interval?: Interval,
  ): Promise<DatapointReturns> {
    const params = new URLSearchParams();

    params.append(`period`, period);

    if (metrics) params.append(`metrics`, metrics);
    if (filters) params.append(`filters`, filters);
    if (interval) params.append("interval", interval);

    const response = await this.getAbstract(`api/v1/stats/timeseries`, params);
    return response.results;
  }

  /**
   * This function allows you to breakdown your stats by some property. If you are familiar with SQL family databases, this function corresponds to running GROUP BY on a certain property in your stats.
   *
   * Check out the [properties](https://plausible.io/docs/stats-api#properties) section for a reference of all the properties you can use in this query.
   */

  public async getBreakdown<Prop extends Property>(
    period: Period,
    property: Prop,
    metrics?: Metrics,
    filters?: string,
    limit?: number,
    page?: number,
  ): Promise<BreakdownReturn<Prop>> {
    const params = new URLSearchParams();

    params.append(`period`, period);
    params.append(`property`, property);

    if (metrics) params.append(`metrics`, metrics);
    if (filters) params.append(`filters`, filters);

    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());

    const response = await this.getAbstract(`api/v1/stats/breakdown`, params);
    return response.results;
  }
}
