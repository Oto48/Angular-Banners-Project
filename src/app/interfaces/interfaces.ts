export interface BannersResponse {
    entities: Banner[];
    searchAfter: string[];
    total: number;
}

export interface Banner {
    id: string;
    active: boolean;
    channelId: string;
    createdAt: string;
    endDate: string;
    fileId: string;
    labels?: string[];
    language: string;
    modifiedAt: string;
    name: string;
    priority: number;
    startDate: string;
    url: string;
    zoneId: string;
    isCorporate?: boolean;
    img?: string;
}

export interface GetBannerRequest {
    pageSize: number;
    pageIndex: number;
    sortBy: string;
    sortDirection: string;
    search: string;
}

export interface SaveBannerRequest {
    data: Banner;
    success: boolean;
}