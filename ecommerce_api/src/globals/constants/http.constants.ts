class HttpConstants {
  public static readonly BAD_REQUEST = 400;
  public static readonly UNAUTHORIZED = 401;
  public static readonly FORBIDDEN = 403;
  public static readonly NOT_FOUND = 404;
  public static readonly METHOD_NOT_ALLOWED = 405;
  public static readonly CONFLICT = 409;
  public static readonly UNPROCESSABLE_ENTITY = 422;
  public static readonly TOO_MANY_REQUESTS = 429;
  public static readonly BAD_GATEWAY = 502;
  public static readonly SERVICE_UNAVAILABLE = 503;
  public static readonly GATEWAY_TIMEOUT = 504;
  public static readonly HTTP_VERSION_NOT_SUPPORTED = 505;
  public static readonly INTERNAL_SERVER_ERROR = 500;
  public static readonly NOT_IMPLEMENTED = 501;
  public static readonly SUCCESS = 200;
}

export default HttpConstants;
