import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { expect, test } from "bun:test";
import { CounterSize, DecrementInstruction, decrementInstructionSchema, IncrementInstruction, incrementInstructionSchema, schema } from "./type";
import * as borsh from "borsh"

let dataAccount:Keypair;
let adminAddress:Keypair;
const programId=new PublicKey("4XTzbbeVNsspRwzSfdYGJGV3R8Qgtqas7BCuEePcRmdx")
test("Account initialization", async()=>{
   dataAccount=Keypair.generate();
   adminAddress=Keypair.generate();
   const connection=new Connection("http://127.0.0.1:8899");
   const tx=await connection.requestAirdrop(adminAddress.publicKey, 1*LAMPORTS_PER_SOL);
   await connection.confirmTransaction(tx);
   const data=await connection.getAccountInfo(adminAddress.publicKey);
   console.log(data);

   const lamport= await connection.getMinimumBalanceForRentExemption(CounterSize);
   const ix= SystemProgram.createAccount({
    fromPubkey:adminAddress.publicKey,
    newAccountPubkey:dataAccount.publicKey,
    lamports:lamport,
    programId:programId,
    space:CounterSize
   })

   const tnx=new Transaction();
   tnx.add(ix);
   const signature= await connection.sendTransaction(tnx, [adminAddress, dataAccount]);
   await connection.confirmTransaction(signature);
   console.log(dataAccount.publicKey.toBase58());

   const dataAccountInfo= await connection.getAccountInfo(dataAccount.publicKey);
   if(!dataAccountInfo){
    return
   }
   const counter=await borsh.deserialize(schema,dataAccountInfo?.data )  ;
   console.log(counter.count)
   expect(counter.count).toBe(0);
})


test("Increment value", async()=>{
const connection=new Connection("http://127.0.0.1:8899");
 
function incrementDataOnchain(vlaue:number){
   const data= borsh.serialize(
      incrementInstructionSchema,
      new IncrementInstruction(vlaue)
   )
   return new TransactionInstruction({
    keys: [
      { pubkey: dataAccount.publicKey, isSigner: false, isWritable: true },
    
    ],
    programId: programId,
    data:data
  })
}

const ix= incrementDataOnchain(4);
const tx=new Transaction();
tx.add(ix);
const signature=await connection.sendTransaction(tx,[adminAddress])
await connection.confirmTransaction(signature);

const dataAccountInfo=await connection.getAccountInfo(dataAccount.publicKey);
const counter= await borsh.deserialize(schema,dataAccountInfo?.data);
console.log(counter.count);

expect(counter.count).toBe(4)



   
 
})


test("decrement value",async()=>{
   const connection=new Connection("http://127.0.0.1:8899");
   function decrementValueOnchain(value:number){
   const data=borsh.serialize(
      decrementInstructionSchema,
      new DecrementInstruction(value)
   )

   return new TransactionInstruction({
      keys:[{ pubkey: dataAccount.publicKey, isSigner: false, isWritable: true }],
      programId: programId,
      data:data
   })

}

const ix2=decrementValueOnchain(2);
const tx2=new Transaction();
tx2.add(ix2);
const signature2=await connection.sendTransaction(tx2,[adminAddress]);
await connection.confirmTransaction(signature2);

const dataAccountDecrementInfo=connection.getAccountInfo(dataAccount.publicKey);
const decrementCounter=await borsh.deserialize(schema, dataAccountDecrementInfo?.data);
console.log(decrementCounter.count);
})

