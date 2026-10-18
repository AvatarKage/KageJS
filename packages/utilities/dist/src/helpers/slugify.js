/* This file is part of KageJS. Copyright (c) 2026 AvatarKage. Released under the MIT license. */
function r(e){return e.toLowerCase().trim().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^\w\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-")}export{r as default};
