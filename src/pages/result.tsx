import { useState, useEffect } from "react";
import { Vote } from "lucide-react";

interface Candidate {
  id: number;
  name: string;
  imageUrl: string;
}

export default function ResultPage() {
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: 1,
      name: "Candidate 1",
      imageUrl:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200&h=200",
    },
    {
      id: 2,
      name: "Candidate 2",
      imageUrl:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200&h=200",
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

  const handleVote = (candidateId: number) => {
    console.log(`Voted for candidate ${candidateId}`);
    // Add your voting logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0a3981] text-white p-6 shadow-lg">
        <div className="container mx-auto flex items-center gap-2">
          <Vote className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Vote Now.</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
          Election Results
        </h1>
        <hr className="mb-8 border-gray-200" />

        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a3981] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="candidate-card bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={candidate.imageUrl}
                    alt={candidate.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {candidate.name}
                  </h3>
                  <button
                    onClick={() => handleVote(candidate.id)}
                    className="w-full bg-[#0a3981] text-white py-2 px-4 rounded-lg hover:bg-[#0a3981]/90 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Vote className="h-5 w-5" />
                    Vote
                  </button>
                </div>
              ))}
            </div>

            <p className="text-center mt-8 text-gray-600 font-mono">
              Connected Account: {accountAddress}
            </p>
          </>
        )}
      </main>
    </div>
  );
}
