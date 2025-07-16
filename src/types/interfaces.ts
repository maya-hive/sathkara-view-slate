export interface AccommodationData {
    id?: number;
    name?: string | undefined;
    slug?: string | undefined;
    status?: number;
    short_description?: string | undefined;
    featured_image?: string | undefined;
    meta_title?: string | undefined;
    meta_description?: string | undefined;
}

export interface AccommodationCategoryData {
    id?: number;
    name?: string | undefined;
    slug?: string | undefined;
    status?: number;
    featured_image?: string | undefined;
}

export interface ActivityData {
    id?: number;
    status?: number;
    featured?: number;
    name?: string | undefined;
    slug?: string | undefined;
    duration?: string | undefined;
    short_description?: string | undefined;
    meta_title?: string | undefined;
    meta_description?: string | undefined;
    featured_image?: string | undefined;
}

export interface ActivityCategoryData {
    id?: number;
    name?: string | undefined;
    slug?: string | undefined;
    status?: number;
    description?: string | undefined;
    meta_title?: string | undefined;
    meta_description?: string | undefined;
    featured_image?: string | undefined;
}