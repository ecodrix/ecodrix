"use client";

import { msg } from "@/components/product-screens/chat";
import { InboxDemo, type Thread } from "@/components/product-screens/inbox-demo";

// Industry pages show the same working inbox with that trade's own chats: example businesses and people only.
const COACHING: Thread[] = [
  {
    id: "kavya",
    name: "Kavya Menon",
    ch: "whatsapp",
    history: [msg({ from: "customer", text: "What are the fees for the Class 10 maths batch?", time: "4:12 pm" })],
    turns: [
      {
        draft: {
          text: "The Class 10 maths batch is ₹18,000 for the year, with classes Monday to Friday at 5 pm. Shall I book a demo class?",
          source: "Batches and fees",
          confidence: 93,
        },
        next: "Yes, Saturday if possible",
      },
      {
        draft: {
          text: "Saturday, 10 am is free for a demo class. Shall I book it?",
          source: "Demo class slots",
          confidence: 90,
        },
        next: "Yes, book it",
      },
    ],
  },
  {
    id: "vikram",
    name: "Vikram Sethi",
    ch: "whatsapp",
    history: [msg({ from: "customer", text: "Is there a weekend batch for NEET?", time: "3:40 pm" })],
    turns: [
      {
        draft: {
          text: "Yes, the NEET weekend batch runs Saturday and Sunday, 9 am to 1 pm.",
          source: "Batches and fees",
          confidence: 91,
        },
        next: "Thanks, I'll discuss at home",
      },
    ],
  },
  {
    id: "anjali",
    name: "Anjali Rao",
    ch: "whatsapp",
    history: [
      msg({ from: "customer", text: "Is the centre open on Sundays?", time: "11:02 am" }),
      msg({
        from: "ai",
        text: "Yes, 9 am to 2 pm on Sundays.",
        source: "Centre hours",
        time: "11:02 am",
        status: "read",
      }),
      msg({ from: "customer", text: "Great, see you then", time: "11:03 am" }),
    ],
    turns: [],
  },
];

const LOCAL_BRAND: Thread[] = [
  {
    id: "isha",
    name: "Isha Verma",
    ch: "whatsapp",
    history: [msg({ from: "customer", text: "Do you have the cotton kurta set in size M?", time: "6:20 pm" })],
    turns: [
      {
        draft: {
          text: "Yes, the cotton kurta set is in stock in M and L at ₹1,499. Shall I send photos?",
          source: "Product list",
          confidence: 92,
        },
        next: "Yes please",
      },
      {
        draft: { text: "Here are the photos.", source: "Product list", confidence: 90, attach: "Kurta-set.pdf" },
        next: "Lovely, thank you",
      },
    ],
  },
  {
    id: "manoj",
    name: "Manoj Pillai",
    ch: "whatsapp",
    history: [msg({ from: "customer", text: "Can I exchange it if the size is wrong?", time: "5:05 pm" })],
    turns: [
      {
        draft: {
          text: "Yes, exchanges are accepted within 7 days if the tag is intact.",
          source: "Exchange policy",
          confidence: 94,
        },
        next: "Okay, thanks",
      },
    ],
  },
  {
    id: "rhea",
    name: "Rhea Nanda",
    ch: "whatsapp",
    history: [
      msg({ from: "customer", text: "Is your shop open on Sunday?", time: "1:15 pm" }),
      msg({ from: "ai", text: "Yes, 11 am to 8 pm every day.", source: "Shop hours", time: "1:15 pm", status: "read" }),
      msg({ from: "customer", text: "Thanks, coming today", time: "1:16 pm" }),
    ],
    turns: [],
  },
];

export const CoachingInbox = () => <InboxDemo list={COACHING} />;
export const LocalBrandInbox = () => <InboxDemo list={LOCAL_BRAND} />;
