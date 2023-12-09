// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
contract CFN is Initializable
{
    //Enum to add the status of a person entering the crowd funding
    enum Status {Unverified, Verified, Member}
    address public anchorOfTrust;
    uint public totalMembers;
    //Enum to add the status of a Proposals entering the crowd funding
    enum ProposalStatus {NotSubmitted, Submitted, Approved, Rejected}
    struct Proposal
    {
        uint amountRequired;
        address requestor;
        string details;
        ProposalStatus sts;
        uint votes;
    }

    Proposal[] public approvedProposals;
    mapping(address=>Proposal) public proposals;

    struct User
    {
        string name;
        Status status;
    }
    mapping(address=>User) public users;

    mapping(address => mapping(address => bool)) public votes;

    event UserVerified(address indexed userAddress, string name);
    event MemberAdded(address indexed memberAddress);

    modifier onlyAnchorOfTrust() {
        require(msg.sender == anchorOfTrust, "Only the anchor of trust can perform this action");
        _;
    }

    modifier isMember(address _memberAddress) {
        require(users[_memberAddress].status == Status.Member, "Company is not a member");
        _;
    }
    
    modifier isVerified(address _userAddress) {
        require(users[_userAddress].status >= Status.Verified, "Company is not verified");
        _;
    }

    function initialize(string memory _name,address _anchorOfTrust)public initializer
    {
        anchorOfTrust=_anchorOfTrust;
        
        users[_anchorOfTrust] = User({name:_name,status:Status.Member});
        unchecked{totalMembers+=1;}
    }

    function viewAnchorOfTrust() public view returns(address)
    {
        return anchorOfTrust;
    }

    function addUser(string memory _name) public 
    {
        // Check if the user already exists
        require(users[msg.sender].status == Status.Unverified, "User already exists or is verified");
        users[msg.sender]=User({name:_name,status:Status.Verified});
    }

    function addMember(address _userAddress)public isVerified(_userAddress) onlyAnchorOfTrust
    {
        require(totalMembers<=10,"DAO members cannot exceed 10");
        users[_userAddress].status = Status.Member;
    }

    function submitProposal(uint _amountRequired, string memory _details) public isVerified(msg.sender)
    {
        require(proposals[msg.sender].sts == ProposalStatus.NotSubmitted, "Already a Proposal is submitted");
        proposals[msg.sender]=Proposal({amountRequired:_amountRequired,requestor:msg.sender,details:_details, sts:ProposalStatus.Submitted,votes:0});
    }

    function voteForProposal(address _requestor) public isMember(msg.sender)
    {
        require(!votes[msg.sender][_requestor],"Already Voted for this Proposal");
        if(proposals[_requestor].votes>=7)
        {
            proposals[_requestor].sts = ProposalStatus.Approved;
            approvedProposals.push(proposals[_requestor]);
            proposals[_requestor].votes+=1;
            votes[msg.sender][_requestor]=true;
            return;
        }
        else {
            proposals[_requestor].votes+=1;
        }
    }
}