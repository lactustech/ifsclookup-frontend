import { useState } from 'react';
import { useRouter } from 'next/router';

// This is our React "component" for the search form.
function SearchForm() {
  const [ifsc, setIfsc] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (ifsc.trim()) {
      // This is the key change!
      // Instead of fetching, we just redirect the user to the
      // new server-rendered page for that IFSC code.
      router.push(`/ifsc/${ifsc.toUpperCase()}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Find Bank Details by IFSC Code</h2>
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
        <input 
          type="text" 
          id="ifsc-input" 
          name="ifsc"
          placeholder="Enter 11-digit IFSC code (e.g., SBIN0000628)" 
          className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          maxLength="11"
          minLength="11"
          pattern="[A-Z]{4}0[A-Z0-9]{6}"
          title="Please enter a valid 11-character IFSC code (e.g., SBIN0000628)"
          value={ifsc}
          onChange={(e) => setIfsc(e.target.value)}
        />
        <button 
          type="submit" 
          id="search-button"
          className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
        >
          Search
        </button>
      </form>
      <p className="text-xs text-gray-500 mt-2">Example: HDFC0000060, ICIC0000104, KKBK0000631</p>
    </div>
  );
}

// This is the main Homepage component
export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
          <div className="container mx-auto max-w-4xl px-4 py-4">
              <h1 className="text-2xl font-bold text-blue-700">ifsclookup.in</h1>
              <p className="text-gray-600">Your Fast & Free Indian Bank IFSC Code Finder</p>
          </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-4xl p-4 mt-8">
        <SearchForm />
        
        {/* You can add more content here, like "Browse by Bank", etc. */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">About This Site</h3>
          <p className="mt-2 text-gray-600">
            Welcome to the new ifsclookup.in! This site provides a fast, free, and accurate way to find details for any bank branch in India. Just enter an 11-digit IFSC code to get started.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center p-8 mt-12 text-gray-500 text-sm">
          <p>&copy; 2025 ifsclookup.in - A free utility. All data is sourced from respective banks and financial institutions.</p>
      </footer>
    </div>
  );
}
