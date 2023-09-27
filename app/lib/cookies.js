export function setCookie(name, value, daysToExpire) {
  const date = new Date();
  date.setTime(date.getTime() + daysToExpire * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expires}; path=/`;
}

export function getCookie(name) {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem(name);
  }
  return null;
}

export function checkCookie(name) {
  let cookies = document.cookie;
  let tokenExist = cookies.includes(name);
  return tokenExist;
}

export function clearAllCookies() {
  sessionStorage.clear();
}

// export function clearAllCookies() {
//   document.cookie.split(";").forEach(function (cookie) {
//     document.cookie =
//       cookie.replace(/^ +/, "").split("=")[0] +
//       "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//   });
// }
