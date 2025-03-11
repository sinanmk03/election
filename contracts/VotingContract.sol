// VotingContract.sol
pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

contract VotingContract {
    struct Candidate {
        uint id;
        string name;
        string imageUrl;
        uint voteCount;
    }

    Candidate[] public candidates;
    mapping(address => bool) public hasVoted;
    address public owner;

    event VoteRecorded(address indexed voter, uint candidateId);

    constructor() public {
        owner = msg.sender;
        // Initialize with some candidates; adjust names and image URLs as needed.
        candidates.push(
            Candidate(0, "Candidate 1", "https://example.com/image1.png", 0)
        );
        candidates.push(
            Candidate(1, "Candidate 2", "https://example.com/image2.png", 0)
        );
    }

    // Cast a vote for a candidate.
    function vote(uint candidateId) public {
        require(!hasVoted[msg.sender], "You have already voted");
        require(candidateId < candidates.length, "Invalid candidate");

        hasVoted[msg.sender] = true;
        candidates[candidateId].voteCount++;
        emit VoteRecorded(msg.sender, candidateId);
    }

    // Retrieve the full list of candidates.
    function getCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }
}
