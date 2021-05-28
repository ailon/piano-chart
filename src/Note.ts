export type Note = "C" | "D" | "E" | "F" | "G" | "A" | "B";
export type Accidental = "#" | "b" | "##" | "bb";

export interface INoteValue {
  note: Note;
  accidental?: Accidental;
  octave?: number;
}

export class NoteValue implements INoteValue {
  public note: Note;  
  public accidental?: Accidental;
  public octave?: number;

  constructor(note: INoteValue | string) {
    if (typeof note === "string") {
      if (note.length > 0) {
        this.note = note[0].toUpperCase() as Note;
        if (note.length > 1) {
          let octave = note.substr(1);
          if (["#", "b"].indexOf(note[1]) > -1) {
            if (note.length > 2 && note[1] === note[2]) {
              this.accidental = note.substr(1, 2) as Accidental;
            } else {
              this.accidental = note[1] as Accidental;
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

    this.toString = this.toString.bind(this);
  }

  public get baseNote(): INoteValue {
    const baseNotes: INoteValue[] = [
      { note: "C" },
      { note: "C", accidental: "#" },
      { note: "D" },
      { note: "D", accidental: "#" },
      { note: "E" },
      { note: "F" },
      { note: "F", accidental: "#" },
      { note: "G" },
      { note: "G", accidental: "#" },
      { note: "A" },
      { note: "A", accidental: "#" },
      { note: "B" }
    ];

    let baseNoteIndex = baseNotes.findIndex(bn => {
      return (
        bn.note === this.note
        && bn.accidental === this.accidental
      )
    });

    let result: INoteValue;
    if (baseNoteIndex > -1) {
      result = {
        note: baseNotes[baseNoteIndex].note,
        accidental: baseNotes[baseNoteIndex].accidental,
        octave: this.octave
      } ;
    } else {
      baseNoteIndex = baseNotes.findIndex(bn => { 
        return bn.note === this.note && bn.accidental === undefined 
      });
      switch (this.accidental) {
        case "#": {
          baseNoteIndex += 1;
          break;
        }
        case "##": {
          baseNoteIndex += 2;
          break;
        }
        case "b": {
          baseNoteIndex -= 1;
          break;
        }
        case "bb": {
          baseNoteIndex -= 2;
          break;
        }
      }

      let octaveMod = 0;
      if (baseNoteIndex < 0) {
        baseNoteIndex += 12;
        octaveMod = -1;
      } else if (baseNoteIndex > 11) {
        baseNoteIndex -= 12;
        octaveMod = 1;
      }

      result = {
        note: baseNotes[baseNoteIndex].note,
        accidental: baseNotes[baseNoteIndex].accidental,
        octave: this.octave !== undefined ? this.octave + octaveMod : undefined
      } ;
    }

    return result;
  }

  public toString(): string {
    let result = this.note.toString();
    if (this.accidental !== undefined) {
      result += this.accidental.toString();
    }
    if (this.octave !== undefined) {
      result += this.octave.toString();
    }
    return result;
  }
}