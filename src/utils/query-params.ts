interface IQueryParams {
  [param: string]: string;
}

export function getQueryParams(): IQueryParams {
  return location.search
    .replace(/^\?/, '')
    .split('&')
    .map(pair => pair.split('=').map(decodeURIComponent))
    .reduce((params, [param, value]) => {
      params[param] = value;
      return params;
    }, {});
}

export function getQueryParam(name: string): string | null {
  const queryParams = getQueryParams();
  return queryParams[name] !== undefined ? queryParams[name] : null;
}
