// The demo's data: seed conversations and the 27.6 s looping script. The script is plain data
// (time in ms, actions); state.ts applies the actions, so the clock hook only has to fire them.

export type Channel = "wa" | "ph";
export type ConvState = "ai" | "need" | "you" | "done";
export type Msg = { f: "in" | "ai" | "you"; t: string } | { f: "ev"; t: string; k?: "hand" };
export type Conv = {
  id: string;
  name: string;
  ini: string;
  ch: Channel;
  // Phone numbers here are +91 55501 00xxx: not a valid Indian mobile or landline, so the demo can never show a real person's number.
  ph: string;
  state: ConvState;
  time: string;
  stage: string;
  value: number;
  msgs: Msg[];
  tl: string[];
};
export type Flow = { id: string; name: string; when: string; runs: number };
export type View = "inbox" | "board" | "cal" | "flow";
/** Which words of the subline light up (`you` = urgent, drawn crimson). */
export type VerbKey = "answer" | "book" | "follow" | "you";
export type ToastGo = { view: View; id?: string };
export type CallPatch = {
  start?: boolean;
  end?: boolean;
  hide?: boolean;
  who?: "in" | "ai";
  st?: string;
  line?: [who: string, text: string] | null;
};

export type Act =
  /** `id`: the conversation the lit word is about (its row glows). */
  | { t: "doing"; text: string; k: VerbKey | null; cap?: string; id?: string }
  | { t: "view"; view: View }
  | { t: "select"; id: string }
  /** Riya's cursor glides to a `data-cur` target (null hides it); `click` presses it. */
  | { t: "cur"; to: string | null }
  | { t: "click" }
  | { t: "say"; id: string; msg: Msg; time?: string; state?: ConvState; tl?: string; also?: Act[] }
  | { t: "book"; id: string; day: string; time: string }
  | { t: "flow"; id: string }
  | { t: "typing"; id: string | null }
  | { t: "add"; conv: Conv }
  | { t: "unseen"; k: "inbox" | "cal" | "flow" }
  | { t: "toast"; text: string; color: string; go: ToastGo }
  | { t: "call"; p: CallPatch }
  | { t: "reset" };

export const STAGES = ["New", "Interested", "Booked", "Visited"];

export const seed = () => ({
  convs: [
    {
      id: "ar",
      name: "Ananya Reddy",
      ini: "AR",
      ch: "wa",
      ph: "+91 55501 00151",
      state: "ai",
      time: "9:12 pm",
      stage: "Interested",
      value: 35000,
      msgs: [
        { f: "in", t: "Hi, how much are braces? Do you have EMI?" },
        {
          f: "ai",
          t: "Braces start at ₹35,000 with no-cost EMI. Dr. Rao checks first in a free consult. Shall I book Monday 11 am?",
        },
      ],
      tl: ["Came from Google · braces page"],
    },
    {
      id: "ps",
      name: "Priya S",
      ini: "PS",
      ch: "wa",
      ph: "+91 55501 00163",
      state: "ai",
      time: "9:08 pm",
      stage: "New",
      value: 1200,
      msgs: [
        { f: "in", t: "Is cleaning painful?" },
        { f: "ai", t: "Not at all, it takes about 30 minutes and most people feel nothing. Want a slot this week?" },
      ],
      tl: ["Messaged your WhatsApp number"],
    },
    {
      id: "mi",
      name: "Mohammed Irfan",
      ini: "MI",
      ch: "ph",
      ph: "+91 55501 00172",
      state: "need",
      time: "8:40 pm",
      stage: "New",
      value: 0,
      msgs: [{ f: "ev", k: "hand", t: "Missed call · 42 s · call back" }],
      tl: ["Called while the line was busy"],
    },
    {
      id: "kt",
      name: "Keerthi T",
      ini: "KT",
      ch: "wa",
      ph: "+91 55501 00119",
      state: "done",
      time: "6:10 pm",
      stage: "Visited",
      value: 2400,
      msgs: [
        { f: "ai", t: "Your check-up is done. Next cleaning reminder in 6 months." },
        { f: "in", t: "ధన్యవాదాలు డాక్టర్ గారు" },
      ],
      tl: ["Check-up done"],
    },
  ] as Conv[],
  booked: 4,
  slots: {
    "Mon 25 Nov": { "10:00 am": "Lakshmi N", "11:00 am": null, "12:30 pm": null },
    "Sat 29 Nov": { "9:30 am": "Venkat G", "10:30 am": null, "12:00 pm": null },
  } as Record<string, Record<string, string | null>>,
  flows: [
    { id: "remind", name: "Visit reminder", when: "The day before every booking", runs: 12 },
    {
      id: "alert",
      name: "Alert the team",
      when: "Pain, refunds or a person asked for: WhatsApp to the doctor on duty",
      runs: 3,
    },
    { id: "follow", name: "Follow up quiet leads", when: "No reply in 2 days: one friendly nudge", runs: 21 },
  ] as Flow[],
  unseen: { inbox: 0, cal: 0, flow: 0 },
});
export type Seed = ReturnType<typeof seed>;

const remind: Act = { t: "flow", id: "remind" };
const click: Act = { t: "click" };

/**
 * [ms on the demo clock, actions]. Cursor moves start ~700 ms before the click they lead to.
 * The last entry restarts the loop.
 */
export const SCRIPT: [number, Act[]][] = [
  [300, [{ t: "cur", to: "row:ar" }]],
  [
    1200,
    [
      click,
      { t: "select", id: "ar" },
      {
        t: "doing",
        text: "Answering Ananya on WhatsApp",
        k: "answer",
        cap: "Riya is answering Ananya on your WhatsApp",
        id: "ar",
      },
    ],
  ],
  [
    2200,
    [
      { t: "say", id: "ar", msg: { f: "in", t: "Yes, Monday morning is best." }, time: "9:13 pm" },
      {
        t: "doing",
        text: "Checking Dr. Rao's free slots for Monday",
        k: "book",
        cap: "Riya is checking Dr. Rao's free slots",
      },
    ],
  ],
  [2300, [{ t: "cur", to: "composer" }]],
  [3200, [{ t: "typing", id: "ar" }]],
  [4300, [{ t: "cur", to: "tab:cal" }]],
  [
    4800,
    [
      { t: "typing", id: null },
      {
        t: "say",
        id: "ar",
        msg: { f: "ai", t: "Booked: Monday 11:00 am with Dr. Rao. I will remind you on Sunday." },
        also: [
          { t: "say", id: "ar", msg: { f: "ev", t: "Booked Mon 11 am · Dr. Rao" }, tl: "Booked Mon 11 am" },
          remind,
        ],
      },
      {
        t: "doing",
        text: "Booked Mon 11 am · CRM stage set to Booked",
        k: "book",
        cap: "Riya booked Ananya for Mon 11 am and updated the CRM",
      },
    ],
  ],
  [5000, [click, { t: "view", view: "cal" }]],
  [5100, [{ t: "book", id: "ar", day: "Mon 25 Nov", time: "11:00 am" }]],
  [5500, [{ t: "cur", to: "tab:inbox" }]],
  [
    5900,
    [
      {
        t: "doing",
        text: "Started the visit reminder",
        k: "follow",
        cap: "The visit reminder is set to go on its own",
      },
    ],
  ],
  [6200, [click, { t: "view", view: "inbox" }]],
  [
    7000,
    [
      {
        t: "add",
        conv: {
          id: "rk",
          name: "Ravi Kumar",
          ini: "RK",
          ch: "wa",
          ph: "+91 55501 00137",
          state: "ai",
          time: "9:15 pm",
          stage: "New",
          value: 0,
          msgs: [{ f: "in", t: "Tooth pain since morning, can doctor see me today?" }],
          tl: ["New on WhatsApp"],
        },
      },
      { t: "unseen", k: "inbox" },
      { t: "typing", id: "rk" },
      { t: "toast", text: "New chat · Ravi Kumar on WhatsApp", color: "var(--hx-ai)", go: { view: "inbox", id: "rk" } },
      {
        t: "doing",
        text: "Reading Ravi on WhatsApp · added to CRM as New",
        k: "answer",
        cap: "New WhatsApp from Ravi, added to your CRM",
        id: "rk",
      },
    ],
  ],
  [
    9000,
    [
      { t: "typing", id: null },
      { t: "say", id: "rk", msg: { f: "ai", t: "Sorry you are in pain. I am getting the team for you right now." } },
      {
        t: "say",
        id: "rk",
        msg: { f: "ev", k: "hand", t: "Handed to your team · pain" },
        state: "need",
        tl: "Handed to your team: pain",
      },
      { t: "flow", id: "alert" },
      { t: "toast", text: "Needs you · Ravi, tooth pain", color: "var(--hx-danger)", go: { view: "inbox", id: "rk" } },
      {
        t: "doing",
        text: "Pain is a person's job · alerted the doctor on duty",
        k: "you",
        cap: "Tooth pain is a job for a person, so Riya called your team",
        id: "rk",
      },
    ],
  ],
  [11500, [{ t: "say", id: "ps", msg: { f: "in", t: "OK, Saturday morning?" }, time: "9:16 pm" }]],
  [12300, [{ t: "cur", to: "tab:cal" }]],
  [
    13000,
    [
      {
        t: "say",
        id: "ps",
        msg: { f: "ai", t: "Saturday 10:30 am is free. Booked, see you then." },
        also: [{ t: "say", id: "ps", msg: { f: "ev", t: "Booked Sat 10:30 am" }, tl: "Booked Sat 10:30 am" }, remind],
      },
      {
        t: "doing",
        text: "Booked Priya Sat 10:30 am on WhatsApp",
        k: "book",
        cap: "Riya booked Priya for Sat 10:30 am on WhatsApp",
      },
      click,
      { t: "view", view: "cal" },
    ],
  ],
  [13100, [{ t: "book", id: "ps", day: "Sat 29 Nov", time: "10:30 am" }]],
  [13900, [{ t: "cur", to: "tab:inbox" }]],
  [14600, [click, { t: "view", view: "inbox" }]],
  // Phone call: Riya picks up, books on the call, and the summary lands in the inbox
  [
    15100,
    [
      {
        t: "add",
        conv: {
          id: "sk",
          name: "Suresh K",
          ini: "SK",
          ch: "ph",
          ph: "+91 55501 00114",
          state: "ai",
          time: "9:20 pm",
          stage: "New",
          value: 0,
          msgs: [{ f: "ev", t: "On a call with Riya" }],
          tl: ["Called your number"],
        },
      },
      { t: "call", p: { start: true, who: "in", st: "Incoming · Riya is picking up", line: null } },
      {
        t: "doing",
        text: "Answering a call from Suresh",
        k: "answer",
        cap: "A call comes in. Riya picks up.",
        id: "sk",
      },
    ],
  ],
  [15500, [{ t: "cur", to: "call" }]],
  [
    15900,
    [
      {
        t: "call",
        p: {
          who: "in",
          st: "On call · Riya is listening",
          line: ["Suresh", "Hello, do you do root canal? My tooth is very sensitive."],
        },
      },
    ],
  ],
  [
    17500,
    [
      {
        t: "call",
        p: {
          who: "ai",
          st: "On call · Riya is speaking",
          line: ["Riya", "Yes, we do. Dr. Rao can check it on Saturday at 12 pm. Shall I book it?"],
        },
      },
    ],
  ],
  [
    19100,
    [{ t: "call", p: { who: "in", st: "On call · Riya is listening", line: ["Suresh", "Yes, please book it."] } }],
  ],
  [
    20100,
    [
      {
        t: "call",
        p: { who: "ai", st: "On call · Riya is speaking", line: ["Riya", "Done. The details are on your WhatsApp."] },
      },
      { t: "book", id: "sk", day: "Sat 29 Nov", time: "12:00 pm" },
      remind,
      {
        t: "doing",
        text: "Booked Suresh Sat 12 pm on the phone",
        k: "book",
        cap: "Riya booked Suresh for Sat 12 pm, on the phone",
      },
    ],
  ],
  [
    21500,
    [
      { t: "call", p: { end: true, st: "Call ended · summary saved" } },
      { t: "say", id: "sk", msg: { f: "ev", t: "Call · {dur} · booked Sat 12 pm" } },
      {
        t: "say",
        id: "sk",
        msg: {
          f: "ai",
          t: "Call summary: tooth sensitivity, wants a root canal check. Booked Sat 12 pm, reminder set.",
        },
        state: "done",
        tl: "Call summary saved",
      },
      {
        t: "doing",
        text: "Call summary saved to Suresh's record",
        k: "answer",
        cap: "The call summary is saved on Suresh's record",
        id: "sk",
      },
    ],
  ],
  [22900, [{ t: "call", p: { hide: true } }]],
  [23400, [{ t: "cur", to: "tab:flow" }]],
  [
    23900,
    [
      { t: "flow", id: "follow" },
      {
        t: "doing",
        text: "Following up 3 quiet leads from last week",
        k: "follow",
        cap: "Riya is following up 3 quiet leads from last week",
      },
    ],
  ],
  [24100, [click, { t: "view", view: "flow" }]],
  [25600, [{ t: "cur", to: "tab:inbox" }]],
  [26300, [click, { t: "view", view: "inbox" }]],
  [26900, [{ t: "cur", to: null }]],
  [27600, [{ t: "reset" }]],
];
