import axios from 'axios';

export interface CategoryDto {
  id: number;
  title: string;
}

export interface PromotionDto {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
  description: string;
  discountRate: number;
  startDate: string;
  endDate: string;
  categoryIds: number[];
  categories: CategoryDto[];
  status: string;
  totalQuantity: number;
  usedQuantity: number;
}

export interface CreatePromotionDto {
  name: string;
  code: string;
  description: string;
  discountRate: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  categoryIds: number[];
  totalQuantity: number;
}

export interface UpdatePromotionDto {
  id: number;
  name: string;
  code: string;
  description: string;
  discountRate: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  categoryIds: number[];
  totalQuantity: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5130';
const API_BASE = `${API_URL}/api/admin/promotions`;

/**
 * Fetches all promotions
 */
export const getAllPromotions = async (): Promise<PromotionDto[]> => {
  try {
    const response = await axios.get<PromotionDto[]>(API_BASE);
    return response.data;
  } catch (error) {
    console.error('Error fetching promotions:', error);
    throw error;
  }
};

/**
 * Fetches a promotion by ID
 */
export const getPromotionById = async (id: number): Promise<PromotionDto> => {
  try {
    const response = await axios.get<PromotionDto>(`${API_BASE}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching promotion with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Creates a new promotion
 */
export const createPromotion = async (promotion: CreatePromotionDto): Promise<PromotionDto> => {
  try {
    console.log('Sending promotion data:', JSON.stringify(promotion, null, 2));
    const response = await axios.post<PromotionDto>(API_BASE, promotion);
    return response.data;
  } catch (error) {
    console.error('Error creating promotion:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};

/**
 * Updates an existing promotion
 */
export const updatePromotion = async (promotion: UpdatePromotionDto): Promise<PromotionDto> => {
  try {
    const response = await axios.put<PromotionDto>(`${API_BASE}/${promotion.id}`, promotion);
    return response.data;
  } catch (error) {
    console.error(`Error updating promotion with ID ${promotion.id}:`, error);
    throw error;
  }
};

/**
 * Deletes a promotion
 */
export const deletePromotion = async (id: number): Promise<boolean> => {
  try {
    await axios.delete(`${API_BASE}/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting promotion with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Fetches all categories for promotion selection
 */
export const getCategoriesForPromotion = async (): Promise<CategoryDto[]> => {
  try {
    const response = await axios.get<CategoryDto[]>(`${API_BASE}/categories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories for promotion:', error);
    throw error;
  }
};

/**
 * Checks if a promotion code is available for use
 */
export const checkPromotionAvailability = async (code: string): Promise<boolean> => {
  try {
    const response = await axios.get<boolean>(`${API_BASE}/check/${code}`);
    return response.data;
  } catch (error) {
    console.error(`Error checking promotion code ${code}:`, error);
    throw error;
  }
};

/**
 * Increments the usage counter for a promotion
 */
export const incrementPromotionUsage = async (id: number): Promise<boolean> => {
  try {
    const response = await axios.post<boolean>(`${API_BASE}/${id}/use`);
    return response.data;
  } catch (error) {
    console.error(`Error incrementing usage for promotion ID ${id}:`, error);
    throw error;
  }
};

/**
 * Updates the total quantity of a promotion
 */
export const updatePromotionQuantity = async (id: number, totalQuantity: number): Promise<PromotionDto> => {
  try {
    // First get the current promotion data
    const promotion = await getPromotionById(id);
    
    // Create a proper UpdatePromotionDto with all required fields
    const updateData: UpdatePromotionDto = {
      id: promotion.id,
      name: promotion.name,
      code: promotion.code,
      description: promotion.description || "",
      discountRate: promotion.discountRate,
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      isActive: promotion.isActive,
      categoryIds: promotion.categoryIds || [],
      totalQuantity: totalQuantity
    };
    
    console.log("Updating promotion with data:", updateData);
    const response = await axios.put<PromotionDto>(`${API_BASE}/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error(`Error updating quantity for promotion ID ${id}:`, error);
    throw error;
  }
}; 