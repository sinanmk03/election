// src/services/Web3Context.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { AbiItem } from "web3-utils";
import VotingContractABI from "../contracts/VotingContract.json";

/** Replace with your deployed address */
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
  addCandidate: (name: string, imageUrl: string) => Promise<void>;
  contract: Contract<AbiItem[]> | null;
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
  const [contract, setContract] = useState<Contract<AbiItem[]> | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const ethereum = (window as any).ethereum;
        if (!ethereum) {
          console.error("MetaMask not detected. Please install or enable it.");
          setLoading(false);
          return;
        }

        const _web3 = new Web3(ethereum);
        await ethereum.request({ method: "eth_requestAccounts" });
        setWeb3(_web3);

        const accounts = await _web3.eth.getAccounts();
        if (!accounts || accounts.length === 0) {
          console.error("No MetaMask accounts found. Is MetaMask locked?");
          setLoading(false);
          return;
        }
        setAccount(accounts[0]);

        const typedAbi = VotingContractABI.abi as AbiItem[];
        const _contract = new _web3.eth.Contract(typedAbi, CONTRACT_ADDRESS);
        setContract(_contract);

        const voted = await _contract.methods.hasVoted(accounts[0]).call();
        setHasVoted(!!voted);
      } catch (err) {
        console.error("Error during Web3 initialization:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const fetchCandidates = useCallback(async () => {
    if (!contract) return;
    try {
      const candidateData = await contract.methods.getCandidates().call();
      const candidatesArray = (candidateData || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        imageUrl: c.imageUrl,
        voteCount: parseInt(c.voteCount, 10),
      }));
      setCandidates(candidatesArray);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  }, [contract]);

  const castVote = async (candidateId: number) => {
    if (!contract || !account) return;
    try {
      await contract.methods.vote(candidateId).send({ from: account });
      setHasVoted(true);
      await fetchCandidates();
    } catch (error) {
      console.error("Error casting vote:", error);
      throw error;
    }
  };

  const addCandidate = async (name: string, imageUrl: string) => {
    if (!contract || !account) return;
    try {
      await contract.methods
        .addCandidate(name, imageUrl)
        .send({ from: account });
      await fetchCandidates();
    } catch (error) {
      console.error("Error adding candidate:", error);
      throw error;
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
        addCandidate,
        contract,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
