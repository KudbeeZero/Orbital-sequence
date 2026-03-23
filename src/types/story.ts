/** Story chapter identifiers */
export type ChapterId = 'prologue' | 'chapter1' | 'chapter2' | 'chapter3' | 'finale';

/** Dialogue speaker identity */
export type Speaker = 'aegis' | 'player' | 'commander' | 'narrator';

export interface DialogueLine {
  speaker: Speaker;
  text: string;
  emotion?: 'neutral' | 'urgent' | 'warning' | 'friendly';
}

export interface StoryChoice {
  id: string;
  text: string;
  consequence: string;
  requiresFlag?: string;
  setsFlag: string;
}

export interface StoryEvent {
  id: string;
  chapter: ChapterId;
  title: string;
  dialogue: DialogueLine[];
  choices: StoryChoice[];
  triggerCondition: StoryTriggerCondition;
}

export interface StoryTriggerCondition {
  type: 'location' | 'combat' | 'resource' | 'time' | 'flag';
  value: string;
  comparison?: 'equals' | 'greaterThan' | 'lessThan';
}

export interface StoryProgress {
  currentChapter: ChapterId;
  completedEvents: string[];
  flags: Record<string, boolean>;
  choicesMade: Record<string, string>;
}
