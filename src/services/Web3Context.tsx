// src/services/Web3Context.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import Web3 from "web3";
import VotingContractABI from "../contracts/VotingContract.json";

// Replace with your deployed contract address.
const CONTRACT_ADDRESS = "0x500b2bc740411265e9be27473bEF810bb09ad7d9";

interface Candidate {
  id: number;
  name: string;
  imageUrl: string;
  voteCount: number;
}

interface Web3ContextType {
  web3: Web3 | null;
  account: string;
  candidates: Candidate[];
  loading: boolean;
  hasVoted: boolean;
  fetchCandidates: () => Promise<void>;
  castVote: (candidateId: number) => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string>("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [contract, setContract] = useState<any>(null);

  useEffect(() => {
    async function init() {
      // Cast window to any so that TypeScript doesn't complain about 'ethereum'
      const ethereum = (window as any).ethereum;
      if (ethereum) {
        const _web3 = new Web3(ethereum);
        await ethereum.request({ method: "eth_requestAccounts" });
        setWeb3(_web3);

        const accounts = await _web3.eth.getAccounts();
        setAccount(accounts[0]);

        const _contract = new _web3.eth.Contract(
          VotingContractABI.abi,
          CONTRACT_ADDRESS
        );
        setContract(_contract);

        // Check if the connected account has already voted
        const voted = await _contract.methods.hasVoted(accounts[0]).call();
        setHasVoted(!!voted);

        setLoading(false);
      } else {
        console.error("MetaMask is not installed.");
      }
    }
    init();
  }, []);

  const fetchCandidates = useCallback(async () => {
    if (contract) {
      try {
        const candidateData = await contract.methods.getCandidates().call();
        const candidatesArray = candidateData.map((c: any, index: number) => ({
          id: index,
          name: c.name,
          imageUrl: c.imageUrl,
          voteCount: parseInt(c.voteCount, 10),
        }));
        setCandidates(candidatesArray);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    }
  }, [contract]);

  const castVote = async (candidateId: number) => {
    if (contract && account) {
      try {
        await contract.methods.vote(candidateId).send({ from: account });
        setHasVoted(true);
        await fetchCandidates();
      } catch (error) {
        throw error;
      }
    }
  };

  return (
    <Web3Context.Provider
      value={{
        web3,
        account,
        candidates,
        loading,
        hasVoted,
        fetchCandidates,
        castVote,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
