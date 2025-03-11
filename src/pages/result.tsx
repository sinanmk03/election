// src/pages/ResultPage.tsx
import { useEffect } from "react";
import { useWeb3 } from "../services/Web3Context";
import { Vote } from "lucide-react";

export default function ResultPage() {
  const { loading, candidates, account, fetchCandidates } = useWeb3();

  useEffect(() => {
    fetchCandidates();
    // Optionally refresh candidate data every 10 seconds for real-time updates.
    const interval = setInterval(fetchCandidates, 10000);
    return () => clearInterval(interval);
  }, [fetchCandidates]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0a3981] text-white p-6 shadow-lg">
        <div className="container mx-auto flex items-center gap-2">
          <Vote className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Election Results</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
          Live Election Results
        </h1>
        <hr className="mb-8 border-gray-200" />

        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a3981] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading results...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={candidate.imageUrl}
                    alt={candidate.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                    {candidate.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl font-bold text-[#0a3981]">
                      {candidate.voteCount.toLocaleString()}
                    </span>
                    <span className="text-gray-600">
                      {candidate.voteCount === 1 ? "Vote" : "Votes"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 font-mono">
                Connected Account: {account || "Not connected"}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Results updated in real-time from blockchain
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
