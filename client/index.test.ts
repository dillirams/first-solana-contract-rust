import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { expect, test } from "bun:test";
import { CounterSize, schema } from "./type";
import * as borsh from "borsh"

let dataAccount:Keypair;
let adminAddress:Keypair;
const programId=new PublicKey("6zEP9epe6q1p98ntG43rAtaazgcHWcNweb89FiTxAz5z")
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



