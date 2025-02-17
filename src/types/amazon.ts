export interface AmazonProduct {
  ASIN: string;
  DetailPageURL: string;
  ItemInfo: {
    Title: {
      DisplayValue: string;
    };
    Features?: {
      DisplayValues: string[];
    };
    ProductInfo?: {
      IsAdultProduct?: {
        DisplayValue: boolean;
      };
    };
  };
  Images: {
    Primary: {
      Small: ImageInfo;
      Medium: ImageInfo;
      Large: ImageInfo;
    };
  };
  Offers?: {
    Listings: Array<{
      Price: {
        Amount: number;
        Currency: string;
        DisplayAmount: string;
      };
      SavedAmount?: {
        Amount: number;
        Currency: string;
        DisplayAmount: string;
      };
      DeliveryInfo?: {
        IsPrimeEligible: boolean;
      };
    }>;
  };
}

interface ImageInfo {
  URL: string;
  Height: number;
  Width: number;
}

export interface AmazonSearchResponse {
  SearchResult: {
    Items: AmazonProduct[];
    TotalResultCount: number;
  };
}

export interface AmazonGetItemsResponse {
  ItemsResult: {
    Items: AmazonProduct[];
  };
}