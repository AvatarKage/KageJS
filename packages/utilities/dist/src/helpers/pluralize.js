/* This file is part of KageJS. Copyright (c) 2026 AvatarKage. Released under the MIT license. */
function t(i){const e=i.trim();return e?/(s|x|z|ch|sh)$/i.test(e)?/ss$/i.test(e)?`${e}es`:e.endsWith("s")?e:`${e}es`:/[^aeiou]y$/i.test(e)?`${e.slice(0,-1)}ies`:/(?:f|fe)$/i.test(e)?/(?:roof|chief|belief|chef)$/i.test(e)?`${e}s`:e.replace(/fe?$/i,"ves"):`${e}s`:i}export{t as default};
