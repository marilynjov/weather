const API_KEY = process.env.OPENWEATHERMAP_API_KEY;

export interface CityResult {
    id: number;
    name: string;
    country: string;
    latitude: number;
    longitude: number;
}

export async 