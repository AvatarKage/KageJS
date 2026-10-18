/* This file is part of KageJS. Copyright (c) 2026 AvatarKage. Released under the MIT license. */
function e(r){const t=r.match(/^(\d+)(d|h|m|s)$/i);if(!t)throw new Error(`Invalid duration format: ${r}`);const o=parseInt(t[1],10),n=t[2].toLowerCase(),a={s:1e3,m:1e3*60,h:1e3*60*60,d:1e3*60*60*24};return o*a[n]}export{e as default};
