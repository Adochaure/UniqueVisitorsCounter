export interface CounterOptions {
  /** Public identifier chosen by the website owner. */
  siteId: string;
  /** API base URL. Defaults to the hosted service URL. */
  apiUrl?: string;
  /** localStorage key used for this site's anonymous browser identifier. */
  storageKey?: string;
}

export interface Counter {
  /** Register this browser if it is new for the site, then return the lifetime total. */
  getCount(): Promise<number>;
}
