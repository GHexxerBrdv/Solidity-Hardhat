// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const TimeLockModule = buildModule("TimeLockModule", (m) => {

    const minDelay = m.getParameter("minDelay", 3600);
    const proposers = m.getParameter("proposers", []);
    const executors = m.getParameter("executors", []);

    const lock = m.contract("Timelock", [
        minDelay, 
        proposers,
        executors
    ]);

    return { lock };
});

module.exports = {TimeLockModule};