const BigNumber = web3.BigNumber;

module.exports = (value) => new BigNumber(value).mul(new BigNumber(10).pow(18))
