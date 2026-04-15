
use borsh::{BorshDeserialize,BorshSerialize};

use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
    entrypoint
};

entrypoint!(counter_contract);

#[derive(BorshDeserialize,BorshSerialize)]
enum InstructionType{
    Increment(u32),
    Decrement(u32)
}

#[derive(BorshDeserialize,BorshSerialize)]
struct Counter{
    count:(u32)
}
pub fn counter_contract(
    program_id:&Pubkey,
    account:&[AccountInfo],
    instrction_data: &[u8]
)->ProgramResult{
    let  acc=next_account_info(&mut account.iter())?;
    let instruction=InstructionType::try_from_slice(instrction_data).unwrap();

  let mut count_value = if acc.data_len() == 0 {
    Counter { count: 0 }
} else {
    Counter::try_from_slice(&acc.data.borrow())?
};

    match instruction {
        InstructionType::Increment(value)=>{
            count_value.count+=value;
        }
        InstructionType::Decrement(value)=>{
            count_value.count-=value;
        }
    }

    count_value.serialize(&mut *acc.data.borrow_mut())?;
    msg!("counter uploaded {}",count_value.count);
    Ok(())
}

