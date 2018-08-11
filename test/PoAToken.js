const moment = require('moment')
const assertRevert = require('./helpers/assertRevert')
const { advanceToBlock } = require('./helpers/advanceToBlock')
const toToken = require('./helpers/toToken')

const BigNumber = web3.BigNumber

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should()

const PoAToken = artifacts.require("./PoAToken.sol")
const TimeShareToken = artifacts.require("./TimeShareToken.sol")

contract('PoA & TST', ([owner, propertySeller, buyer, anotherBuyer]) => {

  const totalSupply = new BigNumber(100 * 10e17)
  const tokensForEther = new BigNumber(10)
  const metaData = "metadata"

  beforeEach(async () => {
    this.poa = await PoAToken.new(propertySeller, totalSupply, tokensForEther, metaData)
    this.tst = await TimeShareToken.at(await this.poa.getTimeShareTokenAddress())
  })

  it("possible to buy tokens", async () => {
    await this.poa.sendTransaction({ value: web3.toWei(1, "ether"), from: buyer })
    const balance = await this.poa.balanceOf(buyer)
    balance.should.be.bignumber.equal(web3.toWei(tokensForEther, "ether"))
  })

  it("not possible to buy more tokens than available", async () => {
    assertRevert(this.poa.sendTransaction({ value: web3.toWei(11, "ether"), from: buyer }))
  })

  it("can check how many PoA tokens are available to buy ", async () => {
    const tokensAvailable = await this.poa.getTokensForSaleAvailable();
    tokensAvailable.should.be.bignumber.equal(totalSupply);
  })

  it("can get PoA token metadata ", async () => {
    const tokenMetaData = await this.poa.getMetaData();
    assert.equal(tokenMetaData, metaData)
  })

  it("can get TST token metadata ", async () => {
    const tokenMetaData = await this.poa.getMetaData();
    assert.equal(tokenMetaData, metaData)
  })

  it("can get TST token address ", async () => {
    const address = await this.poa.getTimeShareTokenAddress();
    assert.equal(address, this.tst.address)
  })

  it("can check if day is booked", async () => {
    const isBooked = await this.tst.isDayBooked(2020, 11, 1)
    assert(!isBooked, "the property should not be booked");
  })

  describe("When buyer holds tokens for some time", () => {
    const timeShareBalanceAfter5Blocks = toToken(5/2/10);

    beforeEach(async () => {
      await this.poa.sendTransaction({ value: web3.toWei(1, "ether"), from: buyer })
      await advanceToBlock(web3.eth.blockNumber + 4)
    })

    it("time share balance is available", async () => {
      const tsBalance = await this.poa.timeShareBalanceOf(buyer)
      tsBalance.should.be.bignumber.equal(toToken(4/2/10))
    })

    it("can claim TST token", async () => {

      await this.poa.claimTimeShareTokens(timeShareBalanceAfter5Blocks/2, {from: buyer})

      const tstBalance = await this.tst.balanceOf(buyer)
      tstBalance.should.be.bignumber.equal(timeShareBalanceAfter5Blocks/2)
      
      const tsBalance = await this.poa.timeShareBalanceOf(buyer)
      tsBalance.should.be.bignumber.equal(timeShareBalanceAfter5Blocks/2)
    })

    it("can't claim TST above available amount", async () => {
      assertRevert(this.poa.claimTimeShareTokens(timeShareBalanceAfter5Blocks+1, {from: buyer}))
    })

    describe("When holder has 1 TST", () => {

      beforeEach(async () => {
        await advanceToBlock(web3.eth.blockNumber + 16)   
        await this.poa.claimTimeShareTokens(toToken(1), {from: buyer})  
      })

      it("can book a day", async () => {

        await this.tst.bookDay(2020, 12, 31, {from: buyer})
        const isBooked = await this.tst.isDayBooked(2020, 12, 31)

        assert(isBooked, "the property is not booked");

        const tstBalance = await this.tst.balanceOf(buyer)
        tstBalance.should.be.bignumber.equal(new BigNumber(0)) 
      })

      it("can't book invalid date", async () => {
        assertRevert(this.tst.bookDay(2020, 20, 31, {from: buyer}))
        assertRevert(this.tst.bookDay(2000, 12, 10, {from: buyer}))
        assertRevert(this.tst.bookDay(2020, 12, 50, {from: buyer}))
      })

      it("can't book if not enough TST", async () => {

        await this.tst.transfer(anotherBuyer, toToken(0.5), {from: buyer}) 

        assertRevert(this.tst.bookDay(2020, 12, 31, {from: buyer}))
      })

      it("can't book when date is already booked", async () => {

        await advanceToBlock(web3.eth.blockNumber + 20)

        await this.poa.claimTimeShareTokens(toToken(1), {from: buyer})  

        await this.tst.bookDay(2020, 12, 31, {from: buyer})
        
        assertRevert(this.tst.bookDay(2020, 12, 31, {from: buyer}))
      })

      it("can book the day and open the door (party!)", async () => {
        await this.tst.bookDay(2020, 12, 31, {from: buyer})
        web3.eth.sign(new Date)
      })
    })
  })
})

