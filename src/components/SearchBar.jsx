import { useState } from "react";

export default function SearchBar({ onSearch, placeholder = "Search..." }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="w-full max-w-md mx-auto mb-6 mt-10">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-black text-black rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
    </div>
  );
}
