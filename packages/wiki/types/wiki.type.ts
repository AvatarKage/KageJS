import { PageMetadata } from "@kagejs/ui";

export interface WikiHero {
    title?: string;
    subtitle?: string;
    image: string;
}

export interface WikiInfobox {
    title: string;
    fields: Record<string, string | number>;
}

export interface WikiProperties {
    slug: string;
    metadata?: PageMetadata;
    hero?: WikiHero;
    infoboxes?: WikiInfobox[];
}

export interface WikiPageType {
    markdown?: string;
    properties: WikiProperties;
}
