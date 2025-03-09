import { useState } from "react";
import { useWeb3 } from "../services/Web3Context";
import { PlusCircle, Vote } from "lucide-react";

export default function AdminPage() {
  const { contract, account, loading, fetchCandidates } = useWeb3();
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    imageUrl: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!newCandidate.name.trim()) {
      setError("Candidate name is required");
      return;
    }

    try {
      await contract.methods
        .addCandidate(newCandidate.name)
        .send({ from: account });
      setSuccessMessage("Candidate added successfully!");
      setNewCandidate({ name: "", imageUrl: "" });
      await fetchCandidates();
    } catch (err) {
      console.error("Error adding candidate:", err);
      setError("Failed to add candidate. Make sure you're the admin.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0a3981] text-white p-6 shadow-lg">
        <div className="container mx-auto flex items-center gap-2">
          <Vote className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Add New Candidate
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleAddCandidate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Candidate Name
              </label>
              <input
                type="text"
                value={newCandidate.name}
                onChange={(e) =>
                  setNewCandidate({ ...newCandidate, name: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0a3981] focus:border-[#0a3981]"
                placeholder="Enter candidate name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL (Optional)
              </label>
              <input
                type="url"
                value={newCandidate.imageUrl}
                onChange={(e) =>
                  setNewCandidate({ ...newCandidate, imageUrl: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0a3981] focus:border-[#0a3981]"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0a3981] text-white py-2 px-4 rounded-lg hover:bg-[#0a3981]/90 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <PlusCircle className="h-5 w-5" />
              {loading ? "Adding Candidate..." : "Add Candidate"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
