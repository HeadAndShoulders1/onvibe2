import HowWork from "@/components/main/how_it_work/page";
import Interested from "@/components/main/interested/page";
import WhatIsDistribution from "@/components/main/WhatIsDistribution/page";

export default function Distribution() {
    return (
        <div className="w-full grid gap-y-[8rem] mt-40">
            <WhatIsDistribution />
            <HowWork />
            <Interested />
        </div>
    )
}