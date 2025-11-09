import Head from 'next/head';

// This is the API URL for your *existing* backend on Render
const API_BASE_URL = "https://ifsclookup-api.onrender.com";

// --- Helper Functions ---

// This function copies text to the clipboard (we need to make it a browser-only function)
function copyToClipboard(text) {
  if (typeof window !== 'undefined') { // Only run in the browser
    try {
      navigator.clipboard.writeText(text).then(() => {
        alert(`Copied "${text}" to clipboard!`); // Using alert for simplicity
      });
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }
}

// This function styles the "NEFT", "RTGS" badges
function ServiceStatus({ label, enabled }) {
  const baseClass = 'px-3 py-1 text-xs font-medium rounded-full';
  const enabledClass = 'bg-green-100 text-green-800';
  const disabledClass = 'bg-gray-100 text-gray-800';
  
  return (
    <span className={`${baseClass} ${enabled ? enabledClass : disabledClass}`}>
      {label}
    </span>
  );
}


// --- The Main Page Component ---
// This component just displays the data it's given.
// It uses the same Tailwind CSS as your index.html.
export default function BranchPage({ branchData }) {
  
  // This is the "404 Not Found" page
  if (!branchData) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header /> {/* Using the Header component from below */}
        <main className="container mx-auto max-w-4xl p-4 mt-8">
          <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded-md">
            <strong>Error:</strong> No details found for this IFSC code. Please check the code and try again.
          </div>
        </main>
        <Footer /> {/* Using the Footer component from below */}
      </div>
    );
  }

  // This is the "Success" page, pre-rendered with data
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* This Head component updates the browser tab & meta description for SEO! */}
      <Head>
        <title>{`IFSC Code ${branchData.ifsc} - ${branchData.branch}, ${branchData.city}`}</title>
        <meta name="description" content={`Find details for IFSC Code ${branchData.ifsc}: ${branchData.bank}, ${branchData.branch} branch, ${branchData.address}, ${branchData.city}.`} />
      </Head>

      <Header />

      <main className="container mx-auto max-w-4xl p-4 mt-8">
        {/* We've replaced the search form with the results */}
        <div id="results-card" className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-100 p-4 border-b border-gray-200">
                <h1 className="text-xl font-semibold text-gray-900">{branchData.branch}</h1>
                <p className="text-sm text-gray-600">{branchData.bank}</p>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1 */}
                <div>
                    <h2 className="font-semibold text-gray-700">Branch Info</h2>
                    <div className="mt-2 text-sm text-gray-600">
                        <p className="py-2 border-b border-gray-100">
                            <strong className="text-gray-800">IFSC:</strong> 
                            <span className="font-mono">{branchData.ifsc}</span>
                            <button onClick={() => copyToClipboard(branchData.ifsc)} className="ml-2 text-xs text-blue-500 hover:text-blue-700">[copy]</button>
                        </p>
                        <p className="py-2 border-b border-gray-100">
                            <strong className="text-gray-800">MICR:</strong> 
                            <span className="font-mono">{branchData.micr || 'N/A'}</span>
                            <button onClick={() => copyToClipboard(branchData.micr)} className="ml-2 text-xs text-blue-500 hover:text-blue-700">[copy]</button>
                        </p>
                        <p className="py-2 border-b border-gray-100">
                            <strong className="text-gray-800">Contact:</strong> 
                            <span>{branchData.contact || 'N/A'}</span>
                        </p>
                    </div>
                </div>
                {/* Column 2 */}
                <div>
                    <h2 className="font-semibold text-gray-700">Location</h2>
                    <div className="mt-2 text-sm text-gray-600">
                        <p className="py-2 border-b border-gray-100">
                            <strong className="text-gray-800">Address:</strong> 
                            <span>{branchData.address || 'N/A'}</span>
                        </p>
                        <p className="py-2 border-b border-gray-100">
                            <strong className="text-gray-800">City:</strong> 
                            <span>{branchData.city || 'N/A'}</span>
                        </p>
                        <p className="py-2 border-b border-gray-100">
                            <strong className="text-gray-800">State:</strong> 
                            <span>{branchData.state || 'N/A'}</span>
                        </p>
                    </div>
                </div>
                {/* Column 3 (Full Width) */}
                <div className="md:col-span-2">
                      <h2 className="font-semibold text-gray-700">Payment Services</h2>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <ServiceStatus label="NEFT" enabled={branchData.neft} />
                        <ServiceStatus label="RTGS" enabled={branchData.rtgs} />
                        <ServiceStatus label="IMPS" enabled={branchData.imps} />
                        <ServiceStatus label="UPI" enabled={branchData.upi} />
                      </div>
                </div>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


// --- Reusable Header and Footer Components ---
function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto max-w-4xl px-4 py-4">
        {/* Make the header clickable to go back home */}
        <a href="/" className="text-2xl font-bold text-blue-700 no-underline">
          ifsclookup.in
        </a>
        <p className="text-gray-600">Your Fast & Free Indian Bank IFSC Code Finder</p>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="text-center p-8 mt-12 text-gray-500 text-sm">
      <p>&copy; 2025 ifsclookup.in - A free utility. All data is sourced from respective banks and financial institutions.</p>
    </footer>
  );
}


// --- ⭐️ THIS IS THE MAGIC (Server-Side Rendering) ⭐️ ---
// This function runs on the SERVER for every request.
export async function getServerSideProps(context) {
  // 1. Get the [code] from the URL (e.g., "HDFC0000060")
  const { code } = context.params;

  try {
    // 2. Call your *existing* FastAPI API on Render
    const res = await fetch(`${API_BASE_URL}/ifsc/${code}`);

    // 3. If the API returns 404 (not found), tell Next.js to show a 404 page
    if (!res.ok) {
      if (res.status === 404) {
        return { props: { branchData: null } }; // We'll pass null to our component
      }
      throw new Error(`Failed to fetch: ${res.status}`);
    }

    // 4. If we get data, pass it to the page component
    const branchData = await res.json();
    return {
      props: { 
        branchData, // This `branchData` is passed to BranchPage component above
      }, 
    };
  } catch (error) {
    console.error("Error fetching branch data:", error);
    // Handle other errors (e.g., API is down)
    return { props: { branchData: null } };
  }
}
