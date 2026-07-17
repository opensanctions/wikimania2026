"use strict";

/*
 * Shared configuration for the live polls — loaded by both pages:
 *
 *   index.html  The presentation = the presenter. Counts votes and
 *               publishes the active question whenever a poll slide
 *               (data-poll="<id>") is shown.
 *   poll.html   The audience page. Shows the active question, casts votes.
 *
 * The channel is stable, so the audience link never changes and can be
 * clicked straight from the slides. Only decks opened with the presenter
 * key publish control messages — the key gates publishing, not reading,
 * and is an accident guard, not a security boundary (the broker and this
 * file are public anyway).
 *
 * Votes travel as retained MQTT messages through a free public broker:
 *   <prefix>/control               retained id of the active question
 *   <prefix>/vote/<qid>/<clientId> retained latest vote per device
 */

// EMQ's free public broker (official EMQX showcase, documented WSS
// endpoint, public status dashboard). If it's ever down on the day, the
// fix is to change this one line and redeploy.
const BROKER_URL = "wss://broker.emqx.io:8084/mqtt";

// Random suffix = our own little namespace on the shared public broker.
const TOPIC_PREFIX = "wikimania2026/ep-poll/k7x2q9";

// The speaker opens index.html?key=<this>. Only keyed decks publish
// control messages; the shared slides link has no key, so followers'
// tabs can never take over the audience page by accident.
const PRESENTER_KEY = "h6t9x2q8";

const YES_NO_UNSURE = [
  ["yes", "Yes"],
  ["no", "No"],
  ["unsure", "Not sure"],
];

const POLLS = [
  // Trick question — every number is wrong, nobody actually knows.
  {
    id: "count",
    q: "How many politicians are there in the world?",
    options: [
      ["100k", "100,000"],
      ["1m", "1 million"],
      ["10m", "10 million"],
      ["unknown", "Nobody knows"],
    ],
  },
  // The definition problem: the same question, harder and harder to answer.
  {
    id: "president",
    q: "Is the President of Uganda a politician?",
    options: YES_NO_UNSURE,
  },
  {
    id: "mayor",
    q: "Is a village mayor a politician?",
    options: YES_NO_UNSURE,
  },
  {
    id: "candidate",
    q: "Is a losing presidential candidate a politician?",
    options: YES_NO_UNSURE,
  },
  {
    id: "judge",
    q: "Is a Supreme Court judge a politician?",
    options: YES_NO_UNSURE,
  },
  {
    id: "first-lady",
    q: "Is the First Lady a politician?",
    options: YES_NO_UNSURE,
  },
];

function pollById(qid) {
  return POLLS.find((p) => p.id === qid);
}
