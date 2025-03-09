// Web3Context.tsx
import { createContext, useContext, useEffect, useState } from "react";
import Web3 from "web3";
import ElectionContract from "../../build/contracts/Election.json";

interface Web3ContextType {
  web3: Web3 | null;
  contract: any;
  account: string;
  loading: boolean;
  candidates: Candidate[];
  hasVoted: boolean;
  fetchCandidates: () => Promise<void>;
  castVote: (candidateId: number) => Promise<void>;
}

interface Candidate {
  id: number;
  name: string;
  voteCount: number;
  imageUrl: string;
}

const Web3Context = createContext<Web3ContextType>({} as Web3ContextType);

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [account, setAccount] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        let web3Instance: Web3;

        if (window.ethereum) {
          web3Instance = new Web3(window.ethereum);
          await window.ethereum.request({ method: "eth_requestAccounts" });
        } else if (window.web3) {
          web3Instance = new Web3(window.web3.currentProvider);
        } else {
          web3Instance = new Web3(
            new Web3.providers.HttpProvider("http://localhost:7545")
          );
        }

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = (ElectionContract as any).networks[
          Number(networkId)
        ];
        const contractInstance = new web3Instance.eth.Contract(
          ElectionContract.abi,
          deployedNetwork && deployedNetwork.address
        );

        const accounts = await web3Instance.eth.getAccounts();
        const votedStatus = await contractInstance.methods
          .voters(accounts[0])
          .call();

        setWeb3(web3Instance);
        setContract(contractInstance);
        setAccount(accounts[0]);
        setHasVoted(votedStatus ? true : false);
        await fetchCandidates(contractInstance);
      } catch (error) {
        console.error("Web3 initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initWeb3();
  }, []);

  const fetchCandidates = async (contractInstance?: any) => {
    const usedContract = contractInstance || contract;
    if (!usedContract) return;

    try {
      const count = await usedContract.methods.candidatesCount().call();
      const candidatesArray: Candidate[] = [];

      for (let i = 1; i <= count; i++) {
        const candidate = await usedContract.methods.candidates(i).call();
        candidatesArray.push({
          id: Number(candidate.id),
          name: candidate.name,
          voteCount: Number(candidate.voteCount),
          imageUrl: `https://picsum.photos/200?random=${i}`,
        });
      }

      setCandidates(candidatesArray);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const castVote = async (candidateId: number) => {
    if (!contract || !account) return;

    try {
      setLoading(true);
      await contract.methods.vote(candidateId).send({ from: account });
      setHasVoted(true);
      await fetchCandidates();
    } catch (error) {
      console.error("Voting error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Web3Context.Provider
      value={{
        web3,
        contract,
        account,
        loading,
        candidates,
        hasVoted,
        fetchCandidates,
        castVote,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
