yarn hardhat --network celo-testnet deploy
yarn hardhat --network celo-testnet add-shelter --name "Test Shelter" --location "Somewhereville" --website "https://foobar.com" --email "foo@bar.com"
yarn hardhat --network celo-testnet add-shelter-manager --shelter-id 447870000 --manager 0x02C4870d0af82440c1c768e078112FB377a1Fc93
yarn hardhat --network celo-testnet add-pet --name Blue --personality "friendly, loyal, good boy" --shelter-id 447870000
yarn hardhat --network celo-testnet get-nft-meta --nft-id 447870000