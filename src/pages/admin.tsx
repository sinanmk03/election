// src/pages/AdminPage.tsx

import { useState } from "react";
import { useWeb3 } from "../services/Web3Context";
import { PlusCircle, Vote, Upload } from "lucide-react";
import { db } from "../services/firebaseConfig"; // optional
import { collection, addDoc } from "firebase/firestore"; // optional
import { uploadToCloudinary } from "../services/cloudinary";

export default function AdminPage() {
  const { addCandidate, account, fetchCandidates } = useWeb3();
  const [isLoading, setIsLoading] = useState(false);
  const [candidateName, setCandidateName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    if (!candidateName.trim()) {
      setError("Candidate name is required.");
      setIsLoading(false);
      return;
    }

    try {
      let finalImageUrl = "";
      if (selectedFile) {
        // This now automatically places the file in the "assets/" folder
        finalImageUrl = await uploadToCloudinary(selectedFile);
      }

      // Call your contract method to add the candidate on-chain
      await addCandidate(candidateName, finalImageUrl);

      // Optionally store an off-chain record in Firestore
      await addDoc(collection(db, "candidates"), {
        name: candidateName,
        imageUrl: finalImageUrl,
        createdAt: new Date().toISOString(),
        adminAddress: account,
      });

      setSuccessMessage("Candidate added successfully!");
      setCandidateName("");
      setSelectedFile(null);

      await fetchCandidates();
    } catch (err) {
      console.error("Error adding candidate:", err);
      setError("Failed to add candidate. Make sure you're the admin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#0a3981] to-[#1e4b94] text-white py-6 px-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Vote className="h-8 w-8 md:h-10 md:w-10" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
          </div>
          <div className="text-sm md:text-base opacity-75">
            {account
              ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
              : "Not Connected"}
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-[#0a3981]/5 p-6 border-b border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              Add New Candidate
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Fill in the details below to add a new candidate to the voting
              system.
            </p>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-2">
                <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-600" />
                {error}
              </div>
            )}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl flex items-center gap-2">
                <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-green-600" />
                {successMessage}
              </div>
            )}{" "}
            <form onSubmit={handleAddCandidate} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Candidate Name
                </label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0a3981]/20 focus:border-[#0a3981] transition-colors duration-200"
                  placeholder="Enter candidate name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Candidate Image
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0a3981]/20 focus:border-[#0a3981] transition-colors duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#0a3981]/10 file:text-[#0a3981] hover:file:bg-[#0a3981]/20"
                  />
                  <Upload className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0a3981] text-white py-3 px-6 rounded-xl hover:bg-[#0a3981]/90 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#0a3981]/10 hover:shadow-xl hover:shadow-[#0a3981]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlusCircle className="h-5 w-5" />
                <span className="font-medium">
                  {isLoading ? "Adding Candidate..." : "Add Candidate"}
                </span>
              </button>
            </form>
          </div>
        </div>
      </main>{" "}
      {isLoading && (
        <div className="fixed inset-0 bg-black/25 flex items-center justify-center">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}
