const Dropchain = artifacts.require("Dropchain");

module.exports = function (deployer) {
  deployer.deploy(Dropchain);
};
