import { Note, INoteValue, NoteValue } from "./Note";

export type NoteNameBehavior = "always" | "onpress" | "onhighlight" | "never";

export interface IInstrumentSettings {
  startOctave?: number,
  startNote?: Note,
  endOctave?: number,
  endNote?: Note,
  showNoteNames?: NoteNameBehavior; // default "onpress"
  highlightedNotes?: Array<INoteValue | string>;
  highlightColor?: string;
  specialHighlightedNotes?:  Array<INoteValue | string>;
  specialHighlightColor?: string;
  showOctaveNumbers?: boolean;
}

export class InstrumentSettings {
  public startOctave: number = 2;
  public startNote: Note = "C";
  public endOctave: number = 6;
  public endNote: Note = "C";
  public showNoteNames: NoteNameBehavior = "onpress";
  public highlightedNotes: NoteValue[] = [];
  public highlightColor: string = "#0c0";
  public specialHighlightedNotes: NoteValue[] = [];
  public specialHighlightColor: string = "#f00";
  public showOctaveNumbers: boolean = false;

  private _reloadNeeded = false;
  public get reloadNeded(): boolean {
    return this._reloadNeeded;
  }

  constructor(settings?: IInstrumentSettings) {
    this.applySettings(settings);
  }

  public applySettings(settings?: IInstrumentSettings) {
    this._reloadNeeded = false;
    if (settings !== undefined) {
      if (settings.startOctave !== undefined) {
        this.startOctave = settings.startOctave;
        this._reloadNeeded = true;
      }
      if (settings.startNote !== undefined) {
        this.startNote = settings.startNote;
        this._reloadNeeded = true;
      }
      if (settings.endOctave !== undefined) {
        this.endOctave = settings.endOctave;
        this._reloadNeeded = true;
      }
      if (settings.endNote !== undefined) {
        this.endNote = settings.endNote;
        this._reloadNeeded = true;
      }
      if (settings.showNoteNames !== undefined) {
        this.showNoteNames = settings.showNoteNames;
        this._reloadNeeded = true;
      }
      if (settings.highlightedNotes !== undefined) {
        this.highlightedNotes.splice(0);
        settings.highlightedNotes.forEach(n => this.highlightedNotes.push(new NoteValue(n)));
      }
      if (settings.highlightColor !== undefined) {
        this.highlightColor = settings.highlightColor;
      }
      if (settings.specialHighlightedNotes !== undefined) {
        this.specialHighlightedNotes.splice(0);
        settings.specialHighlightedNotes.forEach(n => this.specialHighlightedNotes.push(new NoteValue(n)));
      }
      if (settings.specialHighlightColor !== undefined) {
        this.specialHighlightColor = settings.specialHighlightColor;
      }
      if (settings.showOctaveNumbers !== undefined) {
        this.showOctaveNumbers = settings.showOctaveNumbers;
      }
    }
  }
}