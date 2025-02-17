import { supabase } from "@/integrations/supabase/client";
import type { MobileProductData, LaptopProductData } from "../types/productTypes";

type TableName = 'mobile_products' | 'laptops';

export const useProductData = () => {
  const cleanData = (data: any) => {
    const cleanedData = { ...data };
    
    // Remove undefined/null values
    Object.keys(cleanedData).forEach(key => {
      if (cleanedData[key] === undefined || cleanedData[key] === null) {
        delete cleanedData[key];
      }
    });

    // Convert empty arrays to null
    Object.keys(cleanedData).forEach(key => {
      if (Array.isArray(cleanedData[key]) && cleanedData[key].length === 0) {
        delete cleanedData[key];
      }
    });

    // Convert empty strings to null
    Object.keys(cleanedData).forEach(key => {
      if (cleanedData[key] === '') {
        delete cleanedData[key];
      }
    });

    // Handle boolean fields
    const booleanFields = [
      'card_slot', 'nfc', 'radio', 'infrared', 'audio_jack'
    ];
    
    booleanFields.forEach(field => {
      if (field in cleanedData) {
        cleanedData[field] = Boolean(cleanedData[field]);
      }
    });

    // Handle array fields
    const arrayFields = [
      'sensors', 'available_colors', 'model_variants',
      'bands_2g', 'bands_3g', 'bands_4g', 'bands_5g'
    ];

    arrayFields.forEach(field => {
      if (field in cleanedData && typeof cleanedData[field] === 'string') {
        cleanedData[field] = cleanedData[field]
          .split(',')
          .map((item: string) => item.trim())
          .filter(Boolean);
      }
    });

    return cleanedData;
  };

  const checkTableExists = async (table: TableName): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error && error.code === '42P01') {
        return false;
      }
      
      return true;
    } catch (error: any) {
      if (error.code === '42P01') return false;
      throw error;
    }
  };

  const updateProduct = async (
    table: TableName,
    id: string,
    data: MobileProductData | LaptopProductData,
    productType: 'mobile' | 'laptop'
  ) => {
    try {
      const tableExists = await checkTableExists(table);
      if (!tableExists) {
        throw new Error(`Product table not found. Please ensure the database is properly set up.`);
      }

      const cleanedData = cleanData(data);

      const { data: updatedData, error } = await supabase
        .from(table)
        .update(cleanedData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === '23502') {
          throw new Error('Please fill in all required fields');
        }
        throw error;
      }

      if (!updatedData) throw new Error('Failed to update product');
      return updatedData;
    } catch (error: any) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const insertProduct = async (
    table: TableName,
    data: MobileProductData | LaptopProductData,
    productType: 'mobile' | 'laptop'
  ) => {
    try {
      const tableExists = await checkTableExists(table);
      if (!tableExists) {
        throw new Error(`Product table not found. Please ensure the database is properly set up.`);
      }

      const cleanedData = cleanData(data);

      const { data: insertedData, error } = await supabase
        .from(table)
        .insert([cleanedData])
        .select()
        .maybeSingle();

      if (error) {
        if (error.code === '23502') {
          throw new Error('Please fill in all required fields');
        }
        if (error.code === '23505') {
          throw new Error('A product with this name already exists');
        }
        throw error;
      }

      if (!insertedData) throw new Error('Failed to insert product');
      return insertedData;
    } catch (error: any) {
      console.error('Error inserting product:', error);
      throw error;
    }
  };

  return {
    updateProduct,
    insertProduct,
  };
};