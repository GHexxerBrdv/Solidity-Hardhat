const { expect, assert } = require("chai");
const { ethers, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Staginf test", () => {
        let raffle, deployer, fees;
        beforeEach(async () => {
            [deployer] = await ethers.getSigners();
            raffle = await hre.ignition.deploy(
                require("../../ignition/modules/raffle")
            );
            // mock = deployment.vrfCoordinatorMock;
            // await mock.addConsumer("1", raffle.address);
            fees = await raffle.getEntraceFee();
        })

        describe("fullfill random words", () => {

            it("it works with live chain", async () => {
                console.log("Setting up test...")
                const startingTimeStamp = await raffle.getLastTimeStamp()
                const accounts = await ethers.getSigners()

                console.log("Setting up Listener...")
                await new Promise(async (resolve, reject) => {
                    raffle.once("WinnerPicked", async () => {
                        console.log("Winner Picked event fired");

                        try {
                            const recentWinner = await raffle.getRecentWinner()
                            const raffleState = await raffle.getRaffleState()
                            const winnerEndingBalance = await accounts[0].getBalance()
                            const endingTimeStamp = await raffle.getLastTimeStamp()

                            await expect(raffle.getPlayer(0)).to.be.reverted
                            assert.equal(recentWinner.toString(), accounts[0].address)
                            assert.equal(raffleState, 0)
                            assert.equal(
                                winnerEndingBalance.toString(),
                                winnerStartingBalance.add(raffleEntranceFee).toString()
                            )
                            assert(endingTimeStamp > startingTimeStamp)
                            resolve();
                        } catch (error) {
                            console.log(error);
                            reject(e);
                        }
                    })
                })

                console.log("Entering Raffle...")
                const tx = await raffle.enterRaffle({ value: raffleEntranceFee })
                await tx.wait(1)
                console.log("Ok, time to wait...")
                const winnerStartingBalance = await accounts[0].getBalance()
            })
        })
    })