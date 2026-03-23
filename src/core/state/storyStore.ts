import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── Types ──────────────────────────────────────────────────────────────────────

export type Chapter =
  | 'prologue'
  | 'chapter1'
  | 'chapter2'
  | 'chapter3'
  | 'finale';

export interface DialogueLine {
  speaker: string;
  text: string;
  emotion?: string;
}

export interface DialogueState {
  lines: DialogueLine[];
  currentLine: number;
}

// ── State & Actions ────────────────────────────────────────────────────────────

export interface StoryStoreState {
  // State
  currentChapter: Chapter;
  completedEvents: string[];
  flags: Record<string, boolean>;
  choicesMade: Record<string, string>;
  currentDialogue: DialogueState | null;
  isDialogueActive: boolean;

  // Actions
  advanceChapter: () => void;
  completeEvent: (eventId: string) => void;
  setFlag: (flag: string, value: boolean) => void;
  makeChoice: (choiceId: string, optionId: string) => void;
  startDialogue: (lines: DialogueLine[]) => void;
  advanceLine: () => void;
  endDialogue: () => void;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const CHAPTER_ORDER: readonly Chapter[] = [
  'prologue',
  'chapter1',
  'chapter2',
  'chapter3',
  'finale',
] as const;

// ── Store ──────────────────────────────────────────────────────────────────────

export const useStoryStore = create<StoryStoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentChapter: 'prologue',
      completedEvents: [],
      flags: {},
      choicesMade: {},
      currentDialogue: null,
      isDialogueActive: false,

      // Actions
      advanceChapter: () => {
        const { currentChapter } = get();
        const currentIndex = CHAPTER_ORDER.indexOf(currentChapter);
        if (currentIndex < CHAPTER_ORDER.length - 1) {
          set({ currentChapter: CHAPTER_ORDER[currentIndex + 1] });
        }
      },

      completeEvent: (eventId: string) => {
        const { completedEvents } = get();
        if (completedEvents.includes(eventId)) return;
        set({ completedEvents: [...completedEvents, eventId] });
      },

      setFlag: (flag: string, value: boolean) => {
        set((state) => ({
          flags: { ...state.flags, [flag]: value },
        }));
      },

      makeChoice: (choiceId: string, optionId: string) => {
        set((state) => ({
          choicesMade: { ...state.choicesMade, [choiceId]: optionId },
        }));
      },

      startDialogue: (lines: DialogueLine[]) => {
        if (lines.length === 0) return;
        set({
          currentDialogue: { lines, currentLine: 0 },
          isDialogueActive: true,
        });
      },

      advanceLine: () => {
        const { currentDialogue } = get();
        if (!currentDialogue) return;

        const nextLine = currentDialogue.currentLine + 1;
        if (nextLine >= currentDialogue.lines.length) {
          // Reached the end of dialogue
          get().endDialogue();
          return;
        }

        set({
          currentDialogue: { ...currentDialogue, currentLine: nextLine },
        });
      },

      endDialogue: () => {
        set({
          currentDialogue: null,
          isDialogueActive: false,
        });
      },
    }),
    {
      name: 'orbital-sequence-story',
      partialize: (state) => ({
        currentChapter: state.currentChapter,
        completedEvents: state.completedEvents,
        flags: state.flags,
        choicesMade: state.choicesMade,
        // Deliberately exclude dialogue state from persistence
      }),
    },
  ),
);

// ── Selectors ──────────────────────────────────────────────────────────────────

export const selectHasFlag =
  (flag: string) =>
  (state: StoryStoreState): boolean =>
    state.flags[flag] === true;

export const selectChoiceFor =
  (choiceId: string) =>
  (state: StoryStoreState): string | undefined =>
    state.choicesMade[choiceId];

export const selectDialogueLine = (
  state: StoryStoreState,
): DialogueLine | null => {
  if (!state.currentDialogue) return null;
  return (
    state.currentDialogue.lines[state.currentDialogue.currentLine] ?? null
  );
};
