export interface GeographicItemType {
    name: string;
    id: string;
    label: String;
}

export interface GeographicType {
    province: GeographicItemType;
    city: GeographicItemType;
}