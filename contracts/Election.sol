pragma solidity ^0.5.0;

contract Election {
    // Model a Candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Store accounts that have voted
    mapping(address => bool) public voters;
    // Store Candidates
    // Fetch Candidate
    mapping(uint => Candidate) public candidates;
    // Store Candidates Count
    uint public candidatesCount;

    // Voted event
    event votedEvent(uint indexed _candidateId);

    // Constructor (correctly named)
    constructor() public {
        addCandidate("Candidate1");
        addCandidate("Candidate2");
    }

    // Add a new candidate
    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    // Vote for a candidate
    function vote(uint _candidateId) public {
        // Ensure the sender hasn't voted before
        require(!voters[msg.sender], "Already voted");

        // Ensure the candidate is valid
        require(
            _candidateId > 0 && _candidateId <= candidatesCount,
            "Invalid ID"
        );

        // Mark that the sender has voted
        voters[msg.sender] = true;

        // Trigger the voted event
        emit votedEvent(_candidateId);

        // Increment the candidate's vote count
        candidates[_candidateId].voteCount++;
    }
}
