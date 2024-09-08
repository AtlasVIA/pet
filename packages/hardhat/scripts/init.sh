yarn hardhat --network mantle-testnet deploy
yarn hardhat --network optimism-testnet deploy
yarn hardhat --network celo-testnet deploy
yarn hardhat --network zircuit-testnet deploy
#yarn hardhat --network aleph-zero-testnet deploy


yarn hardhat --network mantle-testnet configure
yarn hardhat --network optimism-testnet configure
yarn hardhat --network celo-testnet configure
yarn hardhat --network zircuit-testnet configure
#yarn hardhat --network aleph-zero-testnet configure

yarn hardhat --network celo-testnet add-shelter --accountant 0x02C4870d0af82440c1c768e078112FB377a1Fc93 --name "Test Shelter" --location "Somewhereville" --website "https://foobar.com" --email "foo@bar.com"
yarn hardhat --network celo-testnet add-shelter-manager --shelter-id 447870000 --manager 0x02C4870d0af82440c1c768e078112FB377a1Fc93
yarn hardhat --network celo-testnet add-pet --name Blue --image "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNnGyXJiQkmaE3EZDljvdNCEa7f232VxTpHg&s" --personality "Friendly, loyal, good boy!" --shelter-id 447870000
yarn hardhat --network celo-testnet add-pet --name Fluffy --image "https://media.cnn.com/api/v1/images/stellar/prod/230302162002-01-worlds-ugliest-dog-competition-file-062423.jpg?c=original" --personality "" --shelter-id 447870000
yarn hardhat --network celo-testnet add-pet --name Butch --image "https://patch.com/img/cdn/users/22511888/2015/06/raw/201506558cc4490ffeb.jpg" --personality "friendly, loyal, good boy" --shelter-id 447870000
yarn hardhat --network celo-testnet add-pet --name Sandy --image "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVroZ-1_v_Tn5vpdhozWiIXyz1vYE9UMN-1Q&s" --personality "friendly, loyal, good boy" --shelter-id 447870000
yarn hardhat --network celo-testnet get-nft-meta --nft-id 447870000


