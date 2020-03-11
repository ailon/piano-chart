export type Note = "C" | "D" | "E" | "F" | "G" | "A" | "B";
export type Accidetnal = "#" | "b" | "##" | "bb";

export interface INoteValue {
  note: Note;
  accidental?: Accidetnal;
  octave?: number;
}

export class NoteValue implements INoteValue {
  public note: Note;  
  public accidental?: Accidetnal;
  public octave?: number;

  constructor(note: INoteValue | string) {
    if (typeof note === "string") {
      if (note.length > 0) {
        this.note = note[0].toUpperCase() as Note;
        if (note.length > 1) {
          let octave = note.substr(1);
          if (["#", "b"].indexOf(note[1]) > -1) {
            if (note.length > 2 && note[1] === note[2]) {
              this.accidental = note.substr(1, 2) as Accidetnal;
            } else {
              this.accidental = note[1] as Accidetnal;
            }
            octave = note.substr(this.accidental.toString().length + 1);
          }
          if (octave.length > 0) {
            this.octave = Number.parseInt(octave);
          }
        } 
      } else {
        throw "Can't parse this note";
      }
    } else {
      this.note = note.note;
      this.accidental = note.accidental;
      this.octave = note.octave;
    }
  }
}