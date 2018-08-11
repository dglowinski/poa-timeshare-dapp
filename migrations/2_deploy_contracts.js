const poaToken = artifacts.require("./PoAToken.sol");

module.exports = function(deployer) {
  deployer.deploy(poaToken);
};