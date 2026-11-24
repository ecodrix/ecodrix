import { HeroMotif, PrimaryCta, WhatsAppCta } from "@/components/marketing/kit";
import { HeroShell } from "./hero/HeroShell";

/**
 * Homepage hero: "Hire an AI employee", with a live scripted ERIX console behind the words.
 * On the navy band (swoosh and red dot from the marketing kit). The text is in the first HTML byte; the console is a client island (hero/HeroShell.tsx).
 */
export function Hero() {
  return (
    <HeroShell
      motif={<HeroMotif />}
      actions={
        <>
          <PrimaryCta lg />
          <WhatsAppCta lg />
        </>
      }
    />
  );
}
