export const MODULES = [
  {
    id: "warmup",
    label: "Warmup",
    hint: "Schulte Table",
    desc: "Expand peripheral vision with a 5x5 Schulte table.",
  },
  {
    id: "overload",
    label: "Overload",
    hint: "RSVP Reader",
    desc: "Break subvocalization with one word at a time.",
  },
  {
    id: "cruise",
    label: "Cruise",
    hint: "Pacer Reader",
    desc: "Read at pace with a highlight that blocks regression.",
  },
  {
    id: "recall",
    label: "Recall",
    hint: "Active Output",
    desc: "Blank the page and retrieve everything from memory.",
  },
];

export const PLACEHOLDER_TEXT = `Neuroplasticity is the brain's ability to reorganize itself by forming new neural connections throughout life. When you force your visual system past its comfortable reading speed, the brain is compelled to abandon subvocalization and process meaning directly from the visual signal. This is uncomfortable at first. That discomfort is the signal that adaptation is happening. The goal of overclock training is not comprehension on the first pass. The goal is to expand the bandwidth of the input channel. Comprehension is rebuilt after the channel has widened. Read fast, read ugly, then recall hard.`;

export const DEFAULT_TEXT = `The brain does not see words; it sees patterns of light and converts them into meaning. Every time you read, your eyes make a series of small jumps called saccades, pausing briefly to fixate on clusters of letters. The average untrained reader fixates on almost every single word, spending roughly a quarter of a second on each one, then silently re-reads the previous word to confirm it. This regression is invisible to you, but it can consume a third of your total reading time. Speed reading is not about moving your eyes faster. It is about removing the inefficiencies that were never necessary in the first place.`;

export const STORAGE_KEYS = {
  stats: "rally.stats.v1",
  schulte: "rally.schulte.v1",
  recall: "rally.recall.v1",
};
