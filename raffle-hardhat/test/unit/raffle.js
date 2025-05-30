const { expect, assert } = require("chai");
const { ethers, network } = require("hardhat");


describe("Raffle Test", async () => {
  let raffle, mock, deployer, fees, interval;

  beforeEach(async () => {
    [deployer] = await ethers.getSigners();


    const deployment = await hre.ignition.deploy(
      require("../../ignition/modules/raffle")
    );

    raffle = deployment.raffle;
    mock = deployment.vrfCoordinatorMock;
    await mock.addConsumer("1", raffle.address);
    fees = await raffle.getEntraceFee();
    interval = await raffle.getInterval();
  })

  describe("constructor", async () => {
    it("Raffle is initialize correctly", async () => {
      const raffleState = await raffle.getRaffleState();
      assert.equal(raffleState.toString(), "0");
      assert.equal(interval.toString(), "3");
    });
  });

  describe("enter raffle", () => {
    it("reverts when you don't pay enough", async () => {
      await expect(raffle.enterRaffle()).to.be.reverted;
    });

    it("records player when they enter the raffle", async () => {
      await raffle.enterRaffle({ value: fees });
      const playerFromContract = await raffle.getPlayer(0);
      assert.equal(playerFromContract, deployer.address);

    })

    // it("emits event on enter", async () => {
    //   await expect(raffle.enterRaffle({ value: fees }))
    //     .to.emit(raffle, "RaffleEnter")
    //     .withArgs(deployer.address);
    // });

    it("revert when calculating", async () => {
      await raffle.enterRaffle({ value: fees });
      await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
      await network.provider.send("evm_mine", []);
      await raffle.performUpkeep([]);
      await expect(raffle.enterRaffle()).to.be.reverted;
    })
  });

  describe("checkupkeep", () => {
    it("fails when no one has sent any eth", async () => {
      await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
      await network.provider.send("evm_mine", []);
      const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([]);
      assert(!upkeepNeeded);
    })
    it("returns false if raffle is not open", async () => {
      await raffle.enterRaffle({ value: fees });
      await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
      await network.provider.send("evm_mine", []);
      await raffle.performUpkeep([]);
      const raffleState = await raffle.getRaffleState();
      const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([]);
      assert.equal(upkeepNeeded, false);
      assert.equal(raffleState.toString(), "1");

    })
    it("fails if eough time has not passed", async () => {
      await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
      await network.provider.send("evm_mine", []);
      const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([]);
      assert(!upkeepNeeded);
    })
    it("returns false if raffle is not open", async () => {
      await raffle.enterRaffle({ value: fees });
      await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
      await network.provider.send("evm_mine", []);
      const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([]);
      assert(upkeepNeeded);
    })
  })

  describe("performupkeep", () => {
    it("it can only run if checkupkeep is true", async () => {
      await raffle.enterRaffle({ value: fees });
      await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
      await network.provider.send("evm_mine", []);
      const tx = await raffle.performUpkeep([]);
      assert(tx);
    })

    it("reverts when check upkeen is false", async () => {
      await expect(raffle.performUpkeep([])).to.be.reverted;
    })

    it("updates the raffle states and calls the vrf coorfinator", async () => {
      await raffle.enterRaffle({ value: fees });
      await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
      await network.provider.send("evm_mine", []);
      const txResponce = await raffle.performUpkeep([]);
      const txRecipt = await txResponce.wait(1);
      const reqId = txRecipt.events[1].args.requestId;
      const raffleState = await raffle.getRaffleState();
      assert(reqId.toNumber() > 0);
      assert(raffleState == 1);
    })
  })

  describe("fullfill randomword", () => {
    beforeEach(async () => {
      await raffle.enterRaffle({ value: fees });
      await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
      await network.provider.send("evm_mine", []);
    })

    it("can only be called after perform upkeep", async () => {
      await expect(mock.fulfillRandomWords(0, raffle.address)).to.be.reverted;
      await expect(mock.fulfillRandomWords(1, raffle.address)).to.be.reverted;
    })

    it("picks winner, reset the lottery and send the money to winner", async () => {
      const additionalEntrants = 3;
      const startingAccountIndex = 1;
      const accounts = await ethers.getSigners();

      for (let i = startingAccountIndex; i < startingAccountIndex + additionalEntrants; i++) {
        const accountConnctedRaffle = raffle.connect(accounts[i]);
        await accountConnctedRaffle.enterRaffle({ value: fees });
      }

      const startingTimestamp = await raffle.getLastTimestamp();


      await new Promise(async (resolve, reject) => {
        raffle.once("WinnerPicked", async () => { // event listener for WinnerPicked
          console.log("WinnerPicked event fired!")
          // assert throws an error if it fails, so we need to wrap
          // it in a try/catch so that the promise returns event
          // if it fails.
          try {
            // Now lets get the ending values...
            const recentWinner = await raffle.getRecentWinner()
            const raffleState = await raffle.getRaffleState()
            const winnerBalance = await accounts[2].getBalance()
            const endingTimeStamp = await raffle.getLastTimeStamp()
            await expect(raffle.getPlayer(0)).to.be.reverted
            // Comparisons to check if our ending values are correct:
            assert.equal(recentWinner.toString(), accounts[2].address)
            assert.equal(raffleState, 0)
            assert.equal(
              winnerBalance.toString(),
              startingBalance // startingBalance + ( (raffleEntranceFee * additionalEntrances) + raffleEntranceFee )
                .add(
                  raffleEntranceFee
                    .mul(additionalEntrants)
                    .add(fees)
                )
                .toString()
            )
            assert(endingTimeStamp > startingTimestamp)
            resolve() // if try passes, resolves the promise 
          } catch (e) {
            reject(e) // if try fails, rejects the promise
          }
        })

        // kicking off the event by mocking the chainlink keepers and vrf coordinator
        try {
          const tx = await raffle.performUpkeep("0x")
          const txReceipt = await tx.wait(1)
          startingBalance = await accounts[2].getBalance()
          await mock.fulfillRandomWords(
            txReceipt.events[1].args.requestId,
            raffle.address
          )
        } catch (e) {
          reject(e)
        }
      })

    })
  })

})