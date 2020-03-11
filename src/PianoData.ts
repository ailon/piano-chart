import { Note } from "./Note";

export class PianoData {
  public static readonly WHITE_KEY_RATIO = 6.4;
  public static readonly BLACK_KEY_RATIO = 6.6;
  public static readonly WHITE_BLACK_WIDTH_RATIO = 1.7;
  public static readonly NOTE_LIST: Note[] = [ "C", "D", "E", "F", "G", "A", "B" ];
  public static readonly BLACK_BASE_NOTE_LIST: Note[] = [ "C", "D", "F", "G", "A" ];
}