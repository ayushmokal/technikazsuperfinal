-- Update email format check constraint
ALTER TABLE product_reviews
DROP CONSTRAINT IF EXISTS check_email_format;

ALTER TABLE product_reviews
ADD CONSTRAINT check_email_format
CHECK (
  user_email IS NULL OR
  user_email = '' OR
  user_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);