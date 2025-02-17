-- Query 1: Check mobile products with their images
SELECT 
    id,
    name,
    image_url,
    array_length(gallery_images, 1) as gallery_count,
    gallery_images
FROM mobile_products
WHERE id = '[PRODUCT_ID]';

-- Query 2: Check image URL patterns and validity
SELECT 
    id,
    name,
    image_url,
    CASE
        WHEN image_url IS NULL THEN 'null'
        WHEN image_url = '' THEN 'empty'
        WHEN image_url LIKE 'http%' THEN 'valid_url'
        ELSE 'invalid_url'
    END as main_image_status,
    CASE
        WHEN gallery_images IS NULL THEN 'null'
        WHEN array_length(gallery_images, 1) IS NULL THEN 'empty_array'
        ELSE array_length(gallery_images, 1)::text
    END as gallery_status,
    gallery_images
FROM mobile_products
WHERE id = '[PRODUCT_ID]';

-- Query 3: Check for invalid image URLs in gallery
WITH RECURSIVE unnested_gallery AS (
    SELECT 
        id,
        name,
        unnest(gallery_images) as gallery_image
    FROM mobile_products
    WHERE id = '[PRODUCT_ID]'
)
SELECT 
    id,
    name,
    gallery_image,
    CASE
        WHEN gallery_image IS NULL THEN 'null'
        WHEN gallery_image = '' THEN 'empty'
        WHEN gallery_image LIKE 'http%' THEN 'valid_url'
        ELSE 'invalid_url'
    END as image_status
FROM unnested_gallery;

-- Query 4: Check for duplicate images in gallery
WITH RECURSIVE unnested_gallery AS (
    SELECT 
        id,
        name,
        unnest(gallery_images) as gallery_image
    FROM mobile_products
    WHERE id = '[PRODUCT_ID]'
)
SELECT 
    id,
    name,
    gallery_image,
    COUNT(*) as occurrence_count
FROM unnested_gallery
WHERE gallery_image IS NOT NULL
GROUP BY id, name, gallery_image
HAVING COUNT(*) > 1;

-- Query 5: Compare image storage between databases
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
WHERE id = '[PRODUCT_ID]';