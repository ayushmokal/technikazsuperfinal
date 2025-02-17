import { Link } from "react-router-dom";

export function Logo() {
  // Get the logo source
  const logoSrc = "/logo.png";

  return (
    <Link to="/" className="flex items-center">
      <img 
        src={logoSrc} 
        alt="Technikaz" 
        className="h-50 w-auto sm:h-12 hover:opacity-80 transition-opacity"
      />
    </Link>
  );
}