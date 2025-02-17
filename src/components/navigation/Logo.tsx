import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Link to="/" className="flex items-center">
      <img 
        src="/logo.png" 
        alt="Technikaz" 
        className="h-8 w-auto sm:h-10 hover:opacity-80 transition-opacity"
      />
    </Link>
  );
}