export type VisualProps<S> = {
  /** Controlled state (used by scene check items). */
  state?: S;
  /** False in scene checks: no controls, fixed state. */
  interactive?: boolean;
  onStateChange?: (s: S) => void;
  /** For labels and the text alternative. */
  lang: 'id' | 'en';
};
