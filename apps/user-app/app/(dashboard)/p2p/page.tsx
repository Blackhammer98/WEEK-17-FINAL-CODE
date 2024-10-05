

import { getServerSession } from "next-auth";
import { SendCard } from "../../../components/SendCard";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { PeerToPeerTransaction } from "../../../components/PeertoPeerTransaction";


async function getp2pTranscations(userId:number){
 
    const txns = await prisma.p2pTransfer.findMany({
        where: {
            OR: [
                { toUserId: userId },
                { fromUserId: userId }
            ]
        }
    });
    return txns.map(t => ({
        time: t.timestamp,
        amount: t.amount,
        from : t.fromUserId,
        to : t.toUserId
        
    }))
}

export default async function() {
    const session = await getServerSession(authOptions);
    const userId = Number(session?.user?.id);
    const transactions = await getp2pTranscations(userId);

    return <div className="w-screen">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
           P2P Transfer
        </div>
        <div className="grid grid-cols-1  md:grid-cols-2 p-4">
        <div> 
            <SendCard />
        </div>
        <div>
           <PeerToPeerTransaction 
           transactions={transactions}
           userId={userId}
           />
        </div>
        
    </div>
    </div>
}