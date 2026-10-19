type Time =
    | "s"
    | "m"
    | "h"
    | "d"

export type Duration = `${number}${Time}`;
