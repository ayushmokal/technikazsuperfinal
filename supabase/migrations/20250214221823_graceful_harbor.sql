-- Check mobile products with their images
SELECT 
    id,
    name,
    image_url,
    array_length(gallery_images, 1) as gallery_count,
    gallery_images
FROM mobile_products
WHERE image_url IS NOT NULL 
   OR array_length(gallery_images, 1) > 0;

-- Check laptops with their images
SELECT 
    id,
    name,
    image_url,
    array_length(gallery_images, 1) as gallery_count,
    gallery_images
FROM laptops
WHERE image_url IS NOT NULL 
   OR array_length(gallery_images, 1) > 0;

-- Check for invalid image URLs
SELECT 
    id,
    name,
    image_url,
    gallery_images
FROM (
    SELECT id, name, image_url, gallery_images FROM mobile_products
    UNION ALL
    SELECT id, name, image_url, gallery_images FROM laptops
) products
WHERE 
    image_url LIKE '%undefined%'
    OR image_url LIKE '%null%'
    OR image_url = ''
    OR EXISTS (
        SELECT 1 
        FROM unnest(gallery_images) img 
        WHERE img LIKE '%undefined%' 
           OR img LIKE '%null%'
           OR img = ''
    );

-- Check for duplicate images in gallery
WITH product_images AS (
    SELECT 
        id,
        name,
        image_url,
        unnest(gallery_images) as gallery_image
    FROM (
        SELECT id, name, image_url, gallery_images FROM mobile_products
        UNION ALL
        SELECT id, name, image_url, gallery_images FROM laptops
    ) products
)
SELECT 
    id,
    name,
    gallery_image,
    COUNT(*) as occurrence_count
FROM product_images
WHERE gallery_image IS NOT NULL
GROUP BY id, name, gallery_image
HAVING COUNT(*) > 1;

-- Check image storage statistics
SELECT 
    'mobile_products' as table_name,
    COUNT(*) as total_products,
    COUNT(NULLIF(image_url, '')) as products_with_main_image,
    COUNT(NULLIF(array_length(gallery_images, 1), 0)) as products_with_gallery,
    AVG(CASE WHEN gallery_images IS NOT NULL 
        THEN array_length(gallery_images, 1) 
        ELSE 0 
    END)::numeric(10,2) as avg_gallery_images
FROM mobile_products
UNION ALL
SELECT 
    'laptops' as table_name,
    COUNT(*) as total_products,
    COUNT(NULLIF(image_url, '')) as products_with_main_image,
    COUNT(NULLIF(array_length(gallery_images, 1), 0)) as products_with_gallery,
    AVG(CASE WHEN gallery_images IS NOT NULL 
        THEN array_length(gallery_images, 1) 
        ELSE 0 
    END)::numeric(10,2) as avg_gallery_images
FROM laptops;