// contracts/VotingContract.sol
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
    event CandidateAdded(
        uint indexed candidateId,
        string name,
        string imageUrl
    );

    constructor() public {
        owner = msg.sender;
        // Optionally initialize with a couple of candidates, or leave empty
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can do this");
        _;
    }

    function vote(uint candidateId) public {
        require(!hasVoted[msg.sender], "You have already voted");
        require(candidateId < candidates.length, "Invalid candidate");

        hasVoted[msg.sender] = true;
        candidates[candidateId].voteCount++;
        emit VoteRecorded(msg.sender, candidateId);
    }

    function addCandidate(
        string memory _name,
        string memory _imageUrl
    ) public onlyOwner {
        uint newId = candidates.length;
        candidates.push(Candidate(newId, _name, _imageUrl, 0));
        emit CandidateAdded(newId, _name, _imageUrl);
    }

    function getCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }
}
