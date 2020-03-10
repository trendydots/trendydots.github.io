"use strict";
var precacheConfig = [
    ["./index.html", "2b906a4417e84bfce5260e1ad6ab9ea0"],
    ["./static/css/main.7865597c.css", "d9d11693da8cbf828d143d1e0aa9c3eb"],
    ["./static/js/main.9d668c1a.js", "7387c5be7ce174a5e6326af0fd0f063f"],
    [
      "./static/media/background.15dcc9b0.jpg",
      "15dcc9b0a9a2e515e56b30abdd4bd83b"
    ],
    [
      "./static/media/brand-icons.13db00b7.eot",
      "13db00b7a34fee4d819ab7f9838cc428"
    ],
    [
      "./static/media/brand-icons.a046592b.woff",
      "a046592bac8f2fd96e994733faf3858c"
    ],
    [
      "./static/media/brand-icons.a1a749e8.svg",
      "a1a749e89f578a49306ec2b055c073da"
    ],
    [
      "./static/media/brand-icons.c5ebe0b3.ttf",
      "c5ebe0b32dc1b5cc449a76c4204d13bb"
    ],
    [
      "./static/media/brand-icons.e8c322de.woff2",
      "e8c322de9658cbeb8a774b6624167c2c"
    ],
    ["./static/media/flags.9c74e172.png", "9c74e172f87984c48ddf5c8108cabe67"],
    ["./static/media/icons.0ab54153.woff2", "0ab54153eeeca0ce03978cc463b257f7"],
    ["./static/media/icons.8e3c7f55.eot", "8e3c7f5520f5ae906c6cf6d7f3ddcd19"],
    ["./static/media/icons.962a1bf3.svg", "962a1bf31c081691065fe333d9fa8105"],
    ["./static/media/icons.b87b9ba5.ttf", "b87b9ba532ace76ae9f6edfe9f72ded2"],
    ["./static/media/icons.faff9214.woff", "faff92145777a3cbaf8e7367b4807987"],
    [
      "./static/media/outline-icons.701ae6ab.eot",
      "701ae6abd4719e9c2ada3535a497b341"
    ],
    [
      "./static/media/outline-icons.82f60bd0.svg",
      "82f60bd0b94a1ed68b1e6e309ce2e8c3"
    ],
    [
      "./static/media/outline-icons.ad97afd3.ttf",
      "ad97afd3337e8cda302d10ff5a4026b8"
    ],
    [
      "./static/media/outline-icons.cd6c777f.woff2",
      "cd6c777f1945164224dee082abaea03a"
    ],
    [
      "./static/media/outline-icons.ef60a4f6.woff",
      "ef60a4f6c25ef7f39f2d25a748dbecfe"
    ]
  ],
  cacheName =
    "sw-precache-v3-sw-precache-webpack-plugin-" +
    (self.registration ? self.registration.scope : ""),
  ignoreUrlParametersMatching = [/^utm_/],
  addDirectoryIndex = function(e, t) {
    var a = new URL(e);
    return "./" === a.pathname.slice(-1) && (a.pathname += t), a.toString();
  },
  cleanResponse = function(e) {
    return e.redirected
      ? ("body" in e ? Promise.resolve(e.body) : e.blob()).then(function(t) {
          return new Response(t, {
            headers: e.headers,
            status: e.status,
            statusText: e.statusText
          });
        })
      : Promise.resolve(e);
  },
  createCacheKey = function(e, t, a, n) {
    var c = new URL(e);
    return (
      (n && c.pathname.match(n)) ||
        (c.search +=
          (c.search ? "&" : "") +
          encodeURIComponent(t) +
          "=" +
          encodeURIComponent(a)),
      c.toString()
    );
  },
  isPathWhitelisted = function(e, t) {
    if (0 === e.length) return !0;
    var a = new URL(t).pathname;
    return e.some(function(e) {
      return a.match(e);
    });
  },
  stripIgnoredUrlParameters = function(e, t) {
    var a = new URL(e);
    return (
      (a.hash = ""),
      (a.search = a.search
        .slice(1)
        .split("&")
        .map(function(e) {
          return e.split("=");
        })
        .filter(function(e) {
          return t.every(function(t) {
            return !t.test(e[0]);
          });
        })
        .map(function(e) {
          return e.join("=");
        })
        .join("&")),
      a.toString()
    );
  },
  hashParamName = "_sw-precache",
  urlsToCacheKeys = new Map(
    precacheConfig.map(function(e) {
      var t = e[0],
        a = e[1],
        n = new URL(t, self.location),
        c = createCacheKey(n, hashParamName, a, /\.\w{8}\./);
      return [n.toString(), c];
    })
  );
function setOfCachedUrls(e) {
  return e
    .keys()
    .then(function(e) {
      return e.map(function(e) {
        return e.url;
      });
    })
    .then(function(e) {
      return new Set(e);
    });
}
self.addEventListener("install", function(e) {
  e.waitUntil(
    caches
      .open(cacheName)
      .then(function(e) {
        return setOfCachedUrls(e).then(function(t) {
          return Promise.all(
            Array.from(urlsToCacheKeys.values()).map(function(a) {
              if (!t.has(a)) {
                var n = new Request(a, { credentials: "same-origin" });
                return fetch(n).then(function(t) {
                  if (!t.ok)
                    throw new Error(
                      "Request for " +
                        a +
                        " returned a response with status " +
                        t.status
                    );
                  return cleanResponse(t).then(function(t) {
                    return e.put(a, t);
                  });
                });
              }
            })
          );
        });
      })
      .then(function() {
        return self.skipWaiting();
      })
  );
}),
  self.addEventListener("activate", function(e) {
    var t = new Set(urlsToCacheKeys.values());
    e.waitUntil(
      caches
        .open(cacheName)
        .then(function(e) {
          return e.keys().then(function(a) {
            return Promise.all(
              a.map(function(a) {
                if (!t.has(a.url)) return e.delete(a);
              })
            );
          });
        })
        .then(function() {
          return self.clients.claim();
        })
    );
  }),
  self.addEventListener("fetch", function(e) {
    if ("GET" === e.request.method) {
      var t,
        a = stripIgnoredUrlParameters(
          e.request.url,
          ignoreUrlParametersMatching
        ),
        n = "index.html";
      (t = urlsToCacheKeys.has(a)) ||
        ((a = addDirectoryIndex(a, n)), (t = urlsToCacheKeys.has(a)));
      var c = "./index.html";
      !t &&
        "navigate" === e.request.mode &&
        isPathWhitelisted(["^(?!\\/__).*"], e.request.url) &&
        ((a = new URL(c, self.location).toString()),
        (t = urlsToCacheKeys.has(a))),
        t &&
          e.respondWith(
            caches
              .open(cacheName)
              .then(function(e) {
                return e.match(urlsToCacheKeys.get(a)).then(function(e) {
                  if (e) return e;
                  throw Error(
                    "The cached response that was expected is missing."
                  );
                });
              })
              .catch(function(t) {
                return (
                  console.warn(
                    'Couldn\'t serve response for "%s" from cache: %O',
                    e.request.url,
                    t
                  ),
                  fetch(e.request)
                );
              })
          );
    }
  });