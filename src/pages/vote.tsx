// VotingPage.tsx
import { useEffect } from "react";
import { useWeb3 } from "../services/Web3Context";
import { Vote } from "lucide-react";

export default function VotingPage() {
  const { loading, candidates, account, hasVoted, castVote, fetchCandidates } =
    useWeb3();

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const handleVote = async (candidateId: number) => {
    try {
      await castVote(candidateId);
      alert("Vote recorded successfully!");
    } catch (error: any) {
      alert(error.message || "Voting failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0a3981] text-white p-6 shadow-lg">
        <div className="container mx-auto flex items-center gap-2">
          <Vote className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Vote Now</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
          Election Candidates
        </h1>
        <hr className="mb-8 border-gray-200" />

        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a3981] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading blockchain data...</p>
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
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {candidate.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Votes: {candidate.voteCount}
                  </p>
                  <button
                    onClick={() => handleVote(candidate.id)}
                    disabled={hasVoted}
                    className={`w-full py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
                      hasVoted
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#0a3981] hover:bg-[#0a3981]/90 text-white"
                    }`}
                  >
                    <Vote className="h-5 w-5" />
                    {hasVoted ? "Already Voted" : "Vote"}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 font-mono">
                Connected Account: {account || "Not connected"}
              </p>
              {hasVoted && (
                <p className="text-green-600 mt-2">
                  You've already voted in this election
                </p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
