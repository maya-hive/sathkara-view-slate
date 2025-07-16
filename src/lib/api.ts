import axios from 'axios';
import queryString from "query-string";

import { 
    AccommodationData, 
    AccommodationCategoryData,
    ActivityData, 
    ActivityCategoryData, 
    AudiencesData,
    CityData,
    CountryData, 
    DestinationData,
    ItineraryCategoryData
} from '@/types/interfaces';

const baseURL = process.env.API_URL || '';

export const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export async function fetchData(endpoint: string): Promise<any> {
    try {
        console.log(`Making request to: ${axiosInstance.defaults.baseURL}${endpoint}`);
        const res = await axiosInstance.get(endpoint);
        console.log('Response status:', res.status);
        return res || false;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('API request failed:', error.message);
        } else {
            console.error('API request failed:', error);
        }
        if (typeof error === 'object' && error !== null && 'response' in error) {
            console.error('Response :', error);
        }
        return [];
    }
}

export async function fetchAccommodations(): Promise<any> {

    let page = 1;
    let allData: AccommodationData[] = [];
    let hasNextPage = true;
    const query = queryString.stringify(
        {
            fields: ["id", "status", "name", "slug", "short_description", "meta_title", "meta_description", "featured_image"],
        },
        { arrayFormat: "bracket" }
    );

    while (hasNextPage) {
        
        const endpoint = `/modules/accommodation/index?page=${page}&${query}`;
    
        try {
            const data = await fetchData(endpoint);
        
            if (data?.data?.data?.length) {
                allData.push(...data.data.data);
            }
        
            hasNextPage = Boolean(data.next_page_url);
            if (hasNextPage) page++;
    
        } catch (error) {
            console.error(`Error fetching page ${page}:`, error);
            break;
        }
    }
    
    return allData;
}

export async function fetchAccommodationCategories(): Promise<any> {

    let page = 1;
    let allData: AccommodationCategoryData[] = [];
    let hasNextPage = true;
    const query = queryString.stringify(
        {
            fields: ["id", "status", "name", "slug", "featured_image"],
        },
        { arrayFormat: "bracket" }
    );

    while (hasNextPage) {
        
        const endpoint = `/modules/accommodationCategory/index?page=${page}&${query}`;
    
        try {
            const data = await fetchData(endpoint);
        
            if (data?.data?.data?.length) {
                allData.push(...data.data.data);
            }
        
            hasNextPage = Boolean(data.next_page_url);
            if (hasNextPage) page++;
    
        } catch (error) {
            console.error(`Error fetching page ${page}:`, error);
            break;
        }
    }
    
    return allData;
}

export async function fetchActivities(): Promise<any> {

    let page = 1;
    let allData: ActivityData[] = [];
    let hasNextPage = true;
    const query = queryString.stringify(
        {
            fields: ["id", "status", "name", "slug", "featured_image", "duration", "short_description", "meta_title", "meta_description"],
        },
        { arrayFormat: "bracket" }
    );

    while (hasNextPage) {
        
        const endpoint = `/modules/activity/index?page=${page}&${query}`;
    
        try {
            const data = await fetchData(endpoint);
        
            if (data?.data?.data?.length) {
                allData.push(...data.data.data);
            }
        
            hasNextPage = Boolean(data.next_page_url);
            if (hasNextPage) page++;
    
        } catch (error) {
            console.error(`Error fetching page ${page}:`, error);
            break;
        }
    }
    
    return allData;
}

export async function fetchActivityCategories(): Promise<any> {

    let page = 1;
    let allData: ActivityCategoryData[] = [];
    let hasNextPage = true;
    const query = queryString.stringify(
        {
            fields: ["id", "status", "name", "slug", "description", "meta_title", "meta_description", "featured_image"],
        },
        { arrayFormat: "bracket" }
    );

    while (hasNextPage) {
        
        const endpoint = `/modules/activityCategory/index?page=${page}&${query}`;
    
        try {
            const data = await fetchData(endpoint);
        
            if (data?.data?.data?.length) {
                allData.push(...data.data.data);
            }
        
            hasNextPage = Boolean(data.next_page_url);
            if (hasNextPage) page++;
    
        } catch (error) {
            console.error(`Error fetching page ${page}:`, error);
            break;
        }
    }
    
    return allData;
}

export async function fetchAudiences(): Promise<any> {

    let page = 1;
    let allData: AudiencesData[] = [];
    let hasNextPage = true;
    const query = queryString.stringify(
        {
            fields: ["id", "status", "name", "slug", "featured_image", "short_description", "meta_title", "meta_description"],
        },
        { arrayFormat: "bracket" }
    );

    while (hasNextPage) {
        
        const endpoint = `/modules/audience/index?page=${page}&${query}`;
    
        try {
            const data = await fetchData(endpoint);
        
            if (data?.data?.data?.length) {
                allData.push(...data.data.data);
            }
        
            hasNextPage = Boolean(data.next_page_url);
            if (hasNextPage) page++;
    
        } catch (error) {
            console.error(`Error fetching page ${page}:`, error);
            break;
        }
    }
    
    return allData;
}

export async function fetchCities(): Promise<any> {

    let page = 1;
    let allData: CityData[] = [];
    let hasNextPage = true;
    const query = queryString.stringify(
        {
            fields: ["id", "status", "name", "slug", "featured_image", "short_description", "meta_title", "meta_description"],
        },
        { arrayFormat: "bracket" }
    );

    while (hasNextPage) {
        
        const endpoint = `/modules/city/index?page=${page}&${query}`;
    
        try {
            const data = await fetchData(endpoint);
        
            if (data?.data?.data?.length) {
                allData.push(...data.data.data);
            }
        
            hasNextPage = Boolean(data.next_page_url);
            if (hasNextPage) page++;
    
        } catch (error) {
            console.error(`Error fetching page ${page}:`, error);
            break;
        }
    }
    
    return allData;
}

export async function fetchCountries(): Promise<any> {

    let page = 1;
    let allData: CountryData[] = [];
    let hasNextPage = true;
    const query = queryString.stringify(
        {
            fields: ["id", "status", "name", "slug", "featured_image", "short_description", "meta_title", "meta_description"],
        },
        { arrayFormat: "bracket" }
    );

    while (hasNextPage) {
        
        const endpoint = `/modules/country/index?page=${page}&${query}`;
    
        try {
            const data = await fetchData(endpoint);
        
            if (data?.data?.data?.length) {
                allData.push(...data.data.data);
            }
        
            hasNextPage = Boolean(data.next_page_url);
            if (hasNextPage) page++;
    
        } catch (error) {
            console.error(`Error fetching page ${page}:`, error);
            break;
        }
    }
    
    return allData;
}

export async function fetchDestinations(): Promise<any> {

    let page = 1;
    let allData: DestinationData[] = [];
    let hasNextPage = true;
    const query = queryString.stringify(
        {
            fields: ["id", "status", "name", "slug", "featured_image", "short_description", "meta_title", "meta_description"],
        },
        { arrayFormat: "bracket" }
    );

    while (hasNextPage) {
        
        const endpoint = `/modules/destination/index?page=${page}&${query}`;
    
        try {
            const data = await fetchData(endpoint);
        
            if (data?.data?.data?.length) {
                allData.push(...data.data.data);
            }
        
            hasNextPage = Boolean(data.next_page_url);
            if (hasNextPage) page++;
    
        } catch (error) {
            console.error(`Error fetching page ${page}:`, error);
            break;
        }
    }
    
    return allData;
}

export async function fetchItineraryCategories(): Promise<any> {

    let page = 1;
    let allData: ItineraryCategoryData[] = [];
    let hasNextPage = true;
    const query = queryString.stringify(
        {
            fields: ["id", "status", "name", "slug", "featured_image", "description", "meta_title", "meta_description"],
        },
        { arrayFormat: "bracket" }
    );

    while (hasNextPage) {
        
        const endpoint = `/modules/itineraryCategory/index?page=${page}&${query}`;
    
        try {
            const data = await fetchData(endpoint);
        
            if (data?.data?.data?.length) {
                allData.push(...data.data.data);
            }
        
            hasNextPage = Boolean(data.next_page_url);
            if (hasNextPage) page++;
    
        } catch (error) {
            console.error(`Error fetching page ${page}:`, error);
            break;
        }
    }
    
    return allData;
}