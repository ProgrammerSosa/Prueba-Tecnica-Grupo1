const ACTIVITY_EVENTS = ["mousedown", "keydown", "touchstart", "scroll", "visibilitychange"];

/**
 * Sliding session en cliente: marca actividad del usuario y renueva el JWT
 * cerca del vencimiento llamando a POST /auth/refresh.
 */
export const createSessionKeepAlive = ({
  getState,
  refreshSession,
  onWarn,
  warnWindowMs = 20 * 60 * 1000,
  checkEveryMs = 60 * 1000,
  activityThrottleMs = 15 * 1000,
}) => {
  let warnShownForExpiry = null;
  let lastActivityAt = Date.now();
  let lastMarkedAt = 0;
  let intervalId = null;
  let refreshing = false;

  const markActivity = () => {
    if (typeof document !== "undefined" && document.visibilityState === "hidden") {
      return;
    }
    const now = Date.now();
    lastActivityAt = now;
    if (now - lastMarkedAt < activityThrottleMs) return;
    lastMarkedAt = now;
  };

  const getExpiryMs = () => {
    const { expiresAt, token } = getState();
    if (expiresAt) {
      const t = new Date(expiresAt).getTime();
      if (!Number.isNaN(t)) return t;
    }
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1] || ""));
        if (payload?.exp) return payload.exp * 1000;
      } catch {
        /* token no JWT estándar */
      }
    }
    return null;
  };

  const tick = async () => {
    const { token, isAuthenticated, logout } = getState();
    if (!token || !isAuthenticated) return;

    const expiryMs = getExpiryMs();
    if (!expiryMs) return;

    const now = Date.now();
    if (expiryMs <= now) {
      logout();
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
      return;
    }

    const remaining = expiryMs - now;
    const recentlyActive = now - lastActivityAt < warnWindowMs;

    if (remaining <= warnWindowMs && recentlyActive && !refreshing) {
      if (warnShownForExpiry === expiryMs) return;
      warnShownForExpiry = expiryMs;
      refreshing = true;
      try {
        const result = await refreshSession();
        if (result?.success) {
          warnShownForExpiry = null;
          onWarn?.("renewed");
        } else if (result?.unsupported) {
          onWarn?.("expiring");
        } else {
          onWarn?.("failed");
        }
      } finally {
        refreshing = false;
      }
    }
  };

  const start = () => {
    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, markActivity, { passive: true });
    });
    intervalId = window.setInterval(tick, checkEveryMs);
    tick();
  };

  const stop = () => {
    ACTIVITY_EVENTS.forEach((event) => {
      window.removeEventListener(event, markActivity);
    });
    if (intervalId) window.clearInterval(intervalId);
  };

  return { start, stop, markActivity };
};
