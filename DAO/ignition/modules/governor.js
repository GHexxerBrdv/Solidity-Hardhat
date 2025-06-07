// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { TokenModule } = require("../modules/token");
const { TimeLockModule } = require("../modules/timelock");

module.exports = buildModule("timeLockModule", (m) => {
    const deployer = m.getDeployer();
    const { token } = m.useModule(TokenModule);
    const { lock } = m.useModule(TimeLockModule);
    const QUORUM_PERCENTAGE = 4;

    const proposerRole = m.call(lock,"PROPOSER_ROLE")
    const executorRole = m.call(lock,"EXECUTOR_ROLE")
    const adminRole = m.call(lock,"TIMELOCK_ADMIN_ROLE")

    const governance = m.contract("Timelock", [
        token,
        lock,
        QUORUM_PERCENTAGE
    ]);

    const xero_address = "0x0000000000000000000000000000000000000000"

    m.call(lock, "grantRole", [proposerRole, governance])
    m.call(lock, "grantRole", [executorRole, xero_address])
    m.call(lock, "revokeRole", [adminRole, deployer])

    return { governance };
});
