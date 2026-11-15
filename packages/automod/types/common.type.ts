export type Severity = 
    | "MINOR"
    | "MODERATE"
    | "SEVERE"
;

export type Metadata = {
    id: string;
    name?: string;
    group?: string;
}

export type Source = {
    author?: string;
    location?: string;
};
