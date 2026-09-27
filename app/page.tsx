import { features } from "@/content/site";
import { Categories } from "@/components/sections/Categories";
import { Cities } from "@/components/sections/Cities";
import { Events } from "@/components/sections/Events";
import { FeatureSplit } from "@/components/sections/FeatureSplit";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Manifesto } from "@/components/sections/Manifesto";
import { Membership } from "@/components/sections/Membership";
import { Rewards } from "@/components/sections/Rewards";

export default function Home() {
  return (
    <main>
      <Hero />
      <Categories />
      <Manifesto />
      {features.map((f) => (
        <FeatureSplit key={f.eyebrow} feature={f} />
      ))}
      <Rewards />
      <Cities />
      <Membership />
      <Events />
      <FinalCta />
      <HowItWorks />
    </main>
  );
}
