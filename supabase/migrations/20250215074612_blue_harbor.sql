-- Create a function to diagnose product image data
CREATE OR REPLACE FUNCTION diagnose_product_images(product_uuid uuid)
RETURNS TABLE (
    check_name text,
    check_result jsonb
) AS $$
BEGIN
    -- Check 1: Basic product image data
    RETURN QUERY
    SELECT 
        'basic_image_data',
        jsonb_build_object(
            'id', p.id,
            'name', p.name,
            'image_url', p.image_url,
            'gallery_count', array_length(p.gallery_images, 1),
            'gallery_images', to_jsonb(p.gallery_images)
        )
    FROM mobile_products p
    WHERE p.id = product_uuid
    UNION ALL
    SELECT 
        'image_validity',
        jsonb_build_object(
            'main_image_status', 
            CASE
                WHEN p.image_url IS NULL THEN 'null'
                WHEN p.image_url = '' THEN 'empty'
                WHEN p.image_url LIKE 'http%' THEN 'valid_url'
                ELSE 'invalid_url'
            END,
            'gallery_status',
            CASE
                WHEN p.gallery_images IS NULL THEN 'null'
                WHEN array_length(p.gallery_images, 1) IS NULL THEN 'empty_array'
                ELSE array_length(p.gallery_images, 1)::text
            END
        )
    FROM mobile_products p
    WHERE p.id = product_uuid
    UNION ALL
    SELECT
        'gallery_image_analysis',
        jsonb_agg(
            jsonb_build_object(
                'image_url', gallery_image,
                'status', 
                CASE
                    WHEN gallery_image IS NULL THEN 'null'
                    WHEN gallery_image = '' THEN 'empty'
                    WHEN gallery_image LIKE 'http%' THEN 'valid_url'
                    ELSE 'invalid_url'
                END
            )
        )
    FROM (
        SELECT unnest(gallery_images) as gallery_image
        FROM mobile_products
        WHERE id = product_uuid
    ) t
    UNION ALL
    SELECT
        'duplicate_images',
        jsonb_agg(
            jsonb_build_object(
                'image_url', gallery_image,
                'count', count
            )
        )
    FROM (
        SELECT gallery_image, COUNT(*) as count
        FROM (
            SELECT unnest(gallery_images) as gallery_image
            FROM mobile_products
            WHERE id = product_uuid
        ) t
        GROUP BY gallery_image
        HAVING COUNT(*) > 1
    ) duplicates;
END;
$$ LANGUAGE plpgsql;

-- Create a function to clean product images
CREATE OR REPLACE FUNCTION clean_product_images(product_uuid uuid)
RETURNS void AS $$
DECLARE
    cleaned_gallery text[];
BEGIN
    -- Get current gallery images and clean them
    SELECT ARRAY(
        SELECT DISTINCT unnest
        FROM (
            SELECT unnest(gallery_images)
            FROM mobile_products
            WHERE id = product_uuid
        ) t
        WHERE unnest IS NOT NULL
          AND unnest != ''
          AND unnest NOT LIKE '%undefined%'
          AND unnest NOT LIKE '%null%'
          AND unnest LIKE 'http%'
    ) INTO cleaned_gallery;

    -- Update the product with cleaned gallery
    UPDATE mobile_products
    SET 
        gallery_images = cleaned_gallery,
        image_url = CASE
            WHEN image_url IS NULL OR image_url = '' OR 
                 image_url LIKE '%undefined%' OR 
                 image_url LIKE '%null%' OR 
                 image_url NOT LIKE 'http%'
            THEN NULL
            ELSE image_url
        END,
        updated_at = now()
    WHERE id = product_uuid;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION diagnose_product_images(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION clean_product_images(uuid) TO authenticated;

-- Create helper function to get product stats
CREATE OR REPLACE FUNCTION get_product_image_stats()
RETURNS TABLE (
    metric text,
    value bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT 'Total Products'::text, COUNT(*)::bigint FROM mobile_products
    UNION ALL
    SELECT 'Products with Main Image', COUNT(*) FROM mobile_products WHERE image_url IS NOT NULL AND image_url != ''
    UNION ALL
    SELECT 'Products with Gallery Images', COUNT(*) FROM mobile_products WHERE array_length(gallery_images, 1) > 0
    UNION ALL
    SELECT 'Products with Invalid Main Image', 
           COUNT(*) FROM mobile_products 
           WHERE image_url IS NOT NULL 
             AND (image_url = '' OR image_url NOT LIKE 'http%')
    UNION ALL
    SELECT 'Products with Invalid Gallery Images',
           COUNT(*) FROM mobile_products
           WHERE EXISTS (
               SELECT 1 FROM unnest(gallery_images) img
               WHERE img IS NULL OR img = '' OR img NOT LIKE 'http%'
           );
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION get_product_image_stats() TO authenticated;