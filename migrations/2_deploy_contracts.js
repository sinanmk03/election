// migrations/2_deploy_contracts.js
const VotingContract = artifacts.require("VotingContract");

module.exports = function (deployer) {
  deployer.deploy(VotingContract);
};
