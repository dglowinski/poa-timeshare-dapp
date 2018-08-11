const poaToken = artifacts.require("./PoAToken.sol");

module.exports = function(deployer, _, [, propertySeller]) {
  deployer.deploy(
    poaToken,
    propertySeller, 
    1000000 * 10e17,
    1000,
    JSON.stringify({
      description: "A cozy little place in Berlin",
      photoUrl: "https://d3hnyzq4jj54js.cloudfront.net/orig/pictures/12/40/124063/ctic-specials-berlin-charlottenburg.jpg"
    })
  );
};