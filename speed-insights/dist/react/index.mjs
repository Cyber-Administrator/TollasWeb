"use client";

// src/react/index.tsx
import { useEffect, useRef } from "react";

// package.json
var name = "@vercel/speed-insights";
var version = "1.1.0";

// src/queue.ts
var initQueue = () => {
  if (window.si)
    return;
  window.si = function a(...params) {
    (window.siq = window.siq || []).push(params);
  };
};

// src/utils.ts
function isBrowser() {
  return typeof window !== "undefined";
}
function detectEnvironment() {
  try {
    const env = process.env.NODE_ENV;
    if (env === "development" || env === "test") {
      return "development";
    }
  } catch (e) {
  }
  return "production";
}
function isDevelopment() {
  return detectEnvironment() === "development";
}
function computeRoute(pathname, pathParams) {
  if (!pathname || !pathParams) {
    return pathname;
  }
  let result = pathname;
  try {
    const entries = Object.entries(pathParams);
    for (const [key, value] of entries) {
      if (!Array.isArray(value)) {
        const matcher = turnValueToRegExp(value);
        if (matcher.test(result)) {
          result = result.replace(matcher, `/[${key}]`);
        }
      }
    }
    for (const [key, value] of entries) {
      if (Array.isArray(value)) {
        const matcher = turnValueToRegExp(value.join("/"));
        if (matcher.test(result)) {
          result = result.replace(matcher, `/[...${key}]`);
        }
      }
    }
    return result;
  } catch (e) {
    return pathname;
  }
}
function turnValueToRegExp(value) {
  return new RegExp(`/${escapeRegExp(value)}(?=[/?#]|$)`);
}
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// src/generic.ts
var SCRIPT_URL = "https://va.vercel-scripts.com/v1/speed-insights";
var PROD_SCRIPT_URL = `${SCRIPT_URL}/script.js`;
var DEV_SCRIPT_URL = `${SCRIPT_URL}/script.debug.js`;
var PROXY_SCRIPT_URL = "/_vercel/speed-insights/script.js";
function injectSpeedInsights(props = {}) {
  var _a;
  if (!isBrowser() || props.route === null)
    return null;
  initQueue();
  const isSelfHosted = Boolean(props.dsn);
  const productionScript = isSelfHosted ? PROD_SCRIPT_URL : PROXY_SCRIPT_URL;
  const src = props.scriptSrc || (isDevelopment() ? DEV_SCRIPT_URL : productionScript);
  if (document.head.querySelector(`script[src*="${src}"]`))
    return null;
  if (props.beforeSend) {
    (_a = window.si) == null ? void 0 : _a.call(window, "beforeSend", props.beforeSend);
  }
  const script = document.createElement("script");
  script.src = src;
  script.defer = true;
  script.dataset.sdkn = name + (props.framework ? `/${props.framework}` : "");
  script.dataset.sdkv = version;
  if (props.sampleRate) {
    script.dataset.sampleRate = props.sampleRate.toString();
  }
  if (props.route) {
    script.dataset.route = props.route;
  }
  if (props.endpoint) {
    script.dataset.endpoint = props.endpoint;
  }
  if (props.dsn) {
    script.dataset.dsn = props.dsn;
  }
  if (isDevelopment() && props.debug === false) {
    script.dataset.debug = "false";
  }
  script.onerror = () => {
    console.log(
      `[Vercel Speed Insights] Failed to load script from ${src}. Please check if any content blockers are enabled and try again.`
    );
  };
  document.head.appendChild(script);
  return {
    setRoute: (route) => {
      script.dataset.route = route ?? void 0;
    }
  };
}

// src/react/index.tsx
function SpeedInsights(props) {
  useEffect(() => {
    var _a;
    if (props.beforeSend) {
      (_a = window.si) == null ? void 0 : _a.call(window, "beforeSend", props.beforeSend);
    }
  }, [props.beforeSend]);
  const setScriptRoute = useRef(null);
  useEffect(() => {
    if (!setScriptRoute.current) {
      const script = injectSpeedInsights({
        framework: props.framework || "react",
        ...props
      });
      if (script) {
        setScriptRoute.current = script.setRoute;
      }
    } else if (props.route) {
      setScriptRoute.current(props.route);
    }
  }, [props.route]);
  return null;
}
export {
  SpeedInsights,
  computeRoute
};
//# sourceMappingURL=index.mjs.map