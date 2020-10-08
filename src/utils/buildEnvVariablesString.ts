export default (params: Record<string, string>): string =>
  Object.entries(params)
    .reduce((res, [key, value]) => [...res, `${key}=${value}`], [])
    .join(' ');
