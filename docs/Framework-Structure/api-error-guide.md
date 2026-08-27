# API Error Handling Guide — Angular 19

This document details error propagation, HTTP interception, and status code handling in `angular-template-v4`.

---

## 1. Error Interception Pipeline

```
HttpClient → authInterceptor (attaches Bearer token)
           → ApiError (normalizes HTTP error responses)
           → Router (401 unauthenticated redirects to /login)
           → Component UI (shows error banner or toast)
```

---

## 2. Standard Error Flow

- **401 Unauthorized**: Clears `TokenService`, redirects router to `/login`.
- **403 Forbidden**: Evaluated by `RbacService`. Route access blocked.
- **400 / 422 Validation**: Passed directly to component `errorMessage` signals.
- **500 Server Error**: Caught gracefully with user-friendly fallback messaging.
