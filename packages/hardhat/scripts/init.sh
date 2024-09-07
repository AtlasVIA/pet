npx hardhat --network polygon-amoy deploy
npx hardhat --network polygon-amoy add-shelter --name "Test Shelter" --location "Somewhereville" --website "https://foobar.com" --email "foo@bar.com"
npx hardhat --network polygon-amoy add-shelter-manager --shelter-id 800020000 --manager 0x02C4870d0af82440c1c768e078112FB377a1Fc93
npx hardhat --network polygon-amoy add-pet --name Blue --personality "friendly, loyal, good boy" --shelter-id 800020000
npx hardhat --network polygon-amoy get-nft-meta --nft-id 800020000