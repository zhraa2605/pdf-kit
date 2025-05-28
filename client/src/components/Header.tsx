import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const linkClass = (path: string) =>
    location.pathname === path
      ? "text-blue-600 font-semibold border-b-2 border-blue-600"
      : "text-gray-700 hover:text-blue-600";

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
        <h1 className="text-xl font-bold text-gray-800">PDF Toolkit</h1>
        </Link>
        <nav className="space-x-6">
           <Link to="/pdf" className={linkClass("/convert")}>
            Generate PDF
          </Link>

          <Link to="/merge" className={linkClass("/merge")}>
            Merge PDF Files
          </Link>
          <Link to="/split" className={linkClass("/split")}>
            Split PDF
          </Link>
         

        </nav>
      </div>
    </header>
  );
};

export default Header;
