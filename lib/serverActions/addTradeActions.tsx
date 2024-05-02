"use server";
import prisma from "@/db/prisma";



interface inputData {
  type: string;
  date: any;
  instrument: string;
  setup: string;
  averageEntryPrice: string;
  stopLossPrice: string;
  targetPrice: string;
  averageExitPrice: string;
  noOfLots: string;
  quantityPerLot: string;
  goodBadTrade: string;
  status : string
}

export async function getInstruments() {
    const instruments = await prisma.instruments.findMany()
    return instruments
}

export async function getUserConstants() {
    const instruments = await prisma.instruments.findFirst()
    const setups = await prisma.setups.findFirst()
    return {instruments: instruments?.instruments, setups: setups?.setups}
  
}

export async function addInstrument(instrument: string) {
    try {
        // Fetch the existing row from the database
        const existingInstruments = await prisma.instruments.findFirst();
    
        if (!existingInstruments) {
          throw new Error('No existing instruments found in the database');
        }

        const newInstruments = [...existingInstruments.instruments, instrument]
    
        // Modify the row with the updated data
        const updatedInstruments = await prisma.instruments.update({
          where: { id: existingInstruments.id },
          data: {
            instruments: newInstruments,
          },
        });
        console.log('Instruments updated successfully:', updatedInstruments);
        return updatedInstruments.instruments
      } catch (error) {
        console.error('Error updating instruments:', error);
        return false
      }
}

export async function addTradeSetup(setup: string) {
  try {
      // Fetch the existing row from the database
      const existingSetups = await prisma.setups.findFirst();
  
      if (!existingSetups) {
        throw new Error('No existing Setups found in the database');
      }

      const newSetups = [...existingSetups.setups, setup]
  
      // Modify the row with the updated data
      const updatedSetups = await prisma.setups.update({
        where: { id: existingSetups.id },
        data: {
          setups: newSetups,
        },
      });
      console.log('Setups updated successfully:', updatedSetups);
      return updatedSetups.setups
    } catch (error) {
      console.error('Error updating setups:', error);
      return false
    }
}

export async function addTrade(data:inputData) {
  // console.log(props)
  // const data = props.data
  console.log(data)
  let status = "closed"
  let net = 0;
  let profitLoss = "profit"
  if(data.averageExitPrice == ""){
    status = "open"
  }
  else {
  const parsedEntryPrice = parseFloat(data.averageEntryPrice);
  const parsedExitPrice = parseFloat(data.averageExitPrice);
  const parsedNoOfLots = parseInt(data.noOfLots); // Use parseInt for integers
  const parsedQuantityPerLot = parseFloat(data.quantityPerLot);


  const quantity = parsedNoOfLots * parsedQuantityPerLot;

  if (data.type === "long") {
    net = (parsedExitPrice - parsedEntryPrice) * quantity;
  } else if (data.type === "short") {
    net = (parsedEntryPrice - parsedExitPrice) * quantity;
  } else {
    throw new Error('Invalid trade type. Must be "long" or "short".');
  }
  if (net<=0){profitLoss = "loss"}

  }
  const dataForDb = {
    longShort: data.type,
    profitLoss: status === "closed" ? profitLoss : null,
    net ,
    user: "test", // Replace with actual user logic
    tradeDate: data.date, // Assuming date is in a parseable format
    instrument: data.instrument,
    setup: data.setup,
    stopLoss: parseFloat(data.stopLossPrice) || null, // Handle potential empty string
    target: parseFloat(data.targetPrice) || null, // Handle potential empty string
    entryAvg: parseFloat(data.averageEntryPrice),
    exitAvg: parseFloat(data.averageExitPrice) || null, // Handle potential empty string
    lots: parseInt(data.noOfLots),
    lotSize: parseFloat(data.quantityPerLot) || null, // Handle potential empty string
    status: status, // Replace with logic to determine status (e.g., "open", "closed")
    goodBad: data.goodBadTrade, // Assuming "goodBadTrade" maps to "good" or "bad"
    tags: [], // Initialize as an empty array if no tags are provided
    createdAt: new Date(), // Assuming you want to use moment.js for current timestamp
  };

  console.log(dataForDb)

  try {
    await prisma.trade.create({
      data: dataForDb,
    });
    return true
    console.log('Data inserted successfully!');
  } catch (error) {
    console.error('Error inserting data:', error);
    return false
  }


}