import axios from 'axios';

const API_BASE_URL = 'http://localhost:5130'; 

export interface ProductSearchRequestDto {
  Query: string;
  Filters?: {
    Category?: string[];
    SubCategory?: string[];
    PriceRange?: { Min: number; Max: number };
    Brand?: string[];
    Variations?: Array<{
      OptionId?: number;
      OptionValue?: string;
      VariationId?: number;
      VariationValue?: string;
    }>;
  };
  Sort?: string;
  Page?: number;
  PageSize?: number;
}

export interface ProductItemDto {
  ProductId: number;
  ItemId: number;
  Name: string;
  Description: string;
  Category: string;
  SubCategory: string;
  Brand: string;
  Price: number;
  OldPrice?: number;
  Stock: number;
  Sku: string;
  ImageUrl: string;
  PopularityScore: number;
  HasVariation: boolean;
  CreatedAt: string;
  UpdatedAt: string;
  Tags: string[];
  Rating: number;
  TotalRatingCount: number;
  Status: boolean;
}

export interface ProductSearchResponseDto {
  Total: number;
  Page: number;
  PageSize: number;
  Results: ProductItemDto[];
}

export interface SuggestResponseDto {
  Suggestions: string[];
  ProductNames: string[];
}

export interface ErrorResponseDto {
  Message: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const searchProducts = async (request: ProductSearchRequestDto): Promise<ProductSearchResponseDto> => {
  const response = await api.post<ProductSearchResponseDto>('/api/search', request);
  return response.data;
};

export const getSuggestions = async (query: string): Promise<SuggestResponseDto> => {
  const response = await api.get<SuggestResponseDto>(`/api/suggest?query=${encodeURIComponent(query)}`);
  return response.data;
};

export const searchByImage = async (image: File): Promise<ProductSearchResponseDto> => {
  const formData = new FormData();
  formData.append('image', image);
  const response = await api.post<ProductSearchResponseDto>('/api/search-by-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};