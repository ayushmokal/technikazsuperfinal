import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProductReviewCardProps {
  productName: string;
  rating?: number;
  date?: string;
  author?: string;
  summary?: string;
  pros: string[];
  cons: string[];
  verdict?: string;
}

export function ProductReviewCard({ 
  productName, 
  rating = 7.5,
  date = "Feb 07 2024",
  author = "Tech Expert",
  summary = "Here is a detailed review of the latest model, featuring cutting-edge technology and innovative features.",
  pros = ["Premium build quality", "Excellent performance", "Great camera system"],
  cons = ["Premium pricing", "No charger in box", "Average battery life"],
  verdict = "The device offers a compelling mix of features and performance, making it a strong contender in its price segment. While there are some minor drawbacks, the overall package represents good value for money."
}: ProductReviewCardProps) {
  const navigate = useNavigate();

  const handleReadFullReview = () => {
    // Get the product ID from the URL
    const pathSegments = window.location.pathname.split('/');
    const productId = pathSegments[pathSegments.length - 1];
    navigate(`/product-reviews/${productId}`);
  };

  return (
    <div className="border rounded-lg p-6 space-y-4">
      <div className="flex items-start justify-between border-b pb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 uppercase">
            {productName} REVIEW
          </h3>
          <p className="text-sm text-gray-500">
            {date} By {author}
          </p>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold">{rating}</div>
          <div className="text-sm text-gray-500">/10</div>
        </div>
      </div>

      <p className="text-gray-700">{summary}</p>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h4 className="font-semibold text-green-600 mb-4">PROS</h4>
          <ul className="space-y-2">
            {pros.map((pro, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="text-green-600">+</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-red-600 mb-4">CONS</h4>
          <ul className="space-y-2">
            {cons.map((con, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="text-red-600">-</span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold mb-2">VERDICT</h4>
        <p className="text-gray-700 mb-4">{verdict}</p>
        <Button 
          variant="link" 
          className="text-primary p-0 h-auto font-normal hover:no-underline"
          onClick={handleReadFullReview}
        >
          Read Full Review →
        </Button>
      </div>
    </div>
  );
}