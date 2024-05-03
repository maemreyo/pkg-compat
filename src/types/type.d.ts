export type TNpmPeerResponse = {
  ok: boolean;
  content: TApiContentItem[];
  count: number;
};

export type TApiContentItem = {
  [packageName: string]: string; // e.g. "react": "any"
  version: string; // e.g. "1.0.0"
};

export type TPackage = {
  name: string;
  version: string;
};

type TVersion = {
  latest: string;
  oldest: string;
};

export type TCompatiblePackage = { name: string; version: TVersion };
