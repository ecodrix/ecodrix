import { MkSection, PainGrid } from "@/components/marketing/kit";

/** Where leads go missing today (DS `PainGrid`). Plain statements, no statistics. */
export function Pain() {
  return (
    <MkSection
      id="pain"
      title="Where leads go missing today"
      lead="The work isn't hard. It just falls between WhatsApp, a notebook, a spreadsheet and the payment app."
    >
      <PainGrid
        items={[
          {
            icon: "clock",
            title: "Night enquiries wait till morning",
            text: "A customer asks on WhatsApp at 10 pm. Nobody sees it until the next day, and by then they've asked someone else.",
          },
          {
            icon: "users",
            title: "Follow-ups live in someone's head",
            text: "The second and third follow-up don't go out when the week gets busy, and nobody can see who spoke to the customer last.",
          },
          {
            icon: "phone",
            title: "Calls missed, messages left till morning",
            text: "A call goes unanswered while you are with a customer, and the WhatsApp message that follows sits until the next day.",
          },
        ]}
      />
    </MkSection>
  );
}
