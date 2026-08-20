export {
  AuthError,
  getAuthenticatedClient,
  TokenManager,
  type AuthenticatedClient,
  type ApiResponse,
  type QueryParams,
} from "../auth.js";
export {
  ApiError,
  NotFoundError,
  RateLimitError,
  ServerError,
  ValidationError,
  mapHttpError,
} from "./errors.js";
export { extractPageItems, DEFAULT_PAGE_SIZE } from "./pagination.js";
export {
  communityApi,
  createApiClient,
  eventsApi,
  gamificationApi,
  searchApi,
  usersApi,
} from "../apiClient.js";
