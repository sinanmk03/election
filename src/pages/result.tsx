import { useState, useEffect } from "react";
import { Vote } from "lucide-react";

interface Candidate {
  id: number;
  name: string;
  imageUrl: string;
  voteCount: number;
}

export default function ResultPage() {
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: 1,
      name: "Candidate 1",
      imageUrl:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200&h=200",
      voteCount: 1500,
    },
    {
      id: 2,
      name: "Candidate 2",
      imageUrl:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200&h=200",
      voteCount: 1200,
    },
  ]);
  const [accountAddress, setAccountAddress] = useState<string>("");

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
      setAccountAddress("0x123...abc"); // Example address
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0a3981] text-white p-6 shadow-lg">
        <div className="container mx-auto flex items-center gap-2">
          <Vote className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Election Results</h1>
        </div>
      </header>

      {/* Main Content */}
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
                Connected Account: {accountAddress}
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
