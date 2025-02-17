/*
  # Add detailed review field to expert reviews

  1. Changes
    - Add detailed_review column to expert_reviews table
*/

ALTER TABLE expert_reviews ADD COLUMN IF NOT EXISTS detailed_review text;