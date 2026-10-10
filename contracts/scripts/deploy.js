const { ethers } = require('hardhat');

async function main() {
  console.log('🚀 Deploying NadiPassRegistry (v3) to Monad testnet...');

  const Registry = await ethers.getContractFactory('NadiPassRegistry');
  const registry = await Registry.deploy();
  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log('✅ NadiPassRegistry deployed to:', address);
  console.log('📋 Explorer:', `https://testnet.monadvision.com/address/${address}`);
  console.log('\n📌 Copy ke nadipass-v3/.env.local:');
  console.log(`VITE_NADIPASS_REGISTRY="${address}"`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });