1. writing smart contract in rust.
2. instruction are written in enum and data are written in struct.
  -> both of them should be serializable and deserizable. derive borsh macro 
   for that.
3. define solana system program with its parameter.
4. create contract that takes programid, array of accounts and intruction and returns programResult.
5. iterate through array of account, get deserialized instruction from account.data (this is data account) and also the borrow the value. 
6. match the instruction and perform the specific operation needed and serialize it and add it back to data account.
7. run blockchin locally or in mainet. set config url and deploy it by converting it into binary
8. after deployment you will get programId and write test for it in any language either in js or other
9. during test create class that looks similar to struct in rust and initialize its schema using borsh library. borshjs in js
10. calculate its size, the space it will take in blockchain that allows you to define space and calculate rent epoch
11. than create admin address that creates and airdrop some solana
12. create data account 
13. than again deserialize and get data object from blockhain