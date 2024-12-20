"use client";
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/nextjs/index.tsx
var nextjs_exports = {};
__export(nextjs_exports, {
  SpeedInsights: () => SpeedInsights2
});
module.exports = __toCommonJS(nextjs_exports);
var import_react2 = __toESM(require("react"));

// src/react/index.tsx
var import_react = require("react");

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
  (0, import_react.useEffect)(() => {
    var _a;
    if (props.beforeSend) {
      (_a = window.si) == null ? void 0 : _a.call(window, "beforeSend", props.beforeSend);
    }
  }, [props.beforeSend]);
  const setScriptRoute = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
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

// src/nextjs/utils.ts
var import_navigation = require("next/navigation.js");
var useRoute = () => {
  const params = (0, import_navigation.useParams)();
  const searchParams = (0, import_navigation.useSearchParams)() || new URLSearchParams();
  const path = (0, import_navigation.usePathname)();
  if (!params) {
    return null;
  }
  const finalParams = Object.keys(params).length ? params : Object.fromEntries(searchParams.entries());
  return computeRoute(path, finalParams);
};

// src/nextjs/index.tsx
function SpeedInsightsComponent(props) {
  const route = useRoute();
  return /* @__PURE__ */ import_react2.default.createElement(SpeedInsights, { route, ...props, framework: "next" });
}
function SpeedInsights2(props) {
  return /* @__PURE__ */ import_react2.default.createElement(import_react2.Suspense, { fallback: null }, /* @__PURE__ */ import_react2.default.createElement(SpeedInsightsComponent, { ...props }));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SpeedInsights
});
//# sourceMappingURL=index.js.map