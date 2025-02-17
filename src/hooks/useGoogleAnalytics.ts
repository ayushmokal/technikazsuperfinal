import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as gtag from '@/lib/gtag';

export const useGoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };

    handleRouteChange(location.pathname + location.search);
  }, [location]);

  return {
    trackEvent: gtag.event
  };
};