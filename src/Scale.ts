import { INoteValue, NoteValue } from './Note';

export type Mode = 'chromatic' | 'major' | 'minor' | 'dorian' | 'phrygian' | 
  'lydian' | 'mixolydian' | 'locrian' | 'majorpentatonic' | 'minorpentatonic' | 
  'melodicminor' | 'harmonicminor';

export class Scale {
  public notes: INoteValue[] = [];
  public get root(): INoteValue {
    return this.notes.length > 0 ? this.notes[0] : { note: "C" };
  }
  public mode?: Mode;
  
  constructor(notes: INoteValue[], mode: Mode) {
    this.notes = notes;
    this.mode = mode;
  }
}

export class ScaleHelper {
  public static readonly chromatic: Scale = new Scale([
    new NoteValue('C'),
    new NoteValue('C#'),
    new NoteValue('D'),
    new NoteValue('D#'),
    new NoteValue('E'),
    new NoteValue('F'),
    new NoteValue('F#'),
    new NoteValue('G'),
    new NoteValue('G#'),
    new NoteValue('A'),
    new NoteValue('A#'),
    new NoteValue('B')
  ], 'chromatic');

  public static modeSteps: Map<Mode, number[]> = new Map([
    ['major', [2,2,1,2,2,2,1]],
    ['minor', [2,1,2,2,1,2,2]],
    ['dorian', [2,1,2,2,2,1,2]],
    ['phrygian', [1,2,2,2,1,2,2]],
    ['lydian', [2,2,2,1,2,2,1]],
    ['mixolydian', [2,2,1,2,2,1,2]],
    ['locrian', [1,2,2,1,2,2,2]],
    ['majorpentatonic', [2,2,3,2,3]],
    ['minorpentatonic', [3,2,2,3,2]],
    ['harmonicminor', [2,1,2,2,1,3,1]],
    ['melodicminor', [2,1,2,2,2,2,1]],
  ]);

  public static getScale(root: INoteValue, mode: Mode): Scale {
    const rootBase = (new NoteValue(root)).baseNote;
    const rootIndex = ScaleHelper.chromatic.notes.findIndex(n => rootBase.note === n.note && rootBase.accidental === n.accidental);
    const modeSteps = ScaleHelper.modeSteps.get(mode);
    const resultNotes: INoteValue[] = [];

    if(modeSteps !== undefined) {
      resultNotes.push(rootBase);
      let currentIndex = rootIndex;
      for (let i = 0; i < modeSteps.length; i++) {
        currentIndex = (currentIndex + modeSteps[i]) % 12;
        resultNotes.push(ScaleHelper.chromatic.notes[currentIndex]);
      }
    }

    return new Scale(ScaleHelper.adjustScale(root, resultNotes), mode);
  }

  private static adjustScale(root: INoteValue, baseNotes: INoteValue[]): INoteValue[] {
    let resultNotes: INoteValue[] = [];
    baseNotes.forEach(note => {
      if (root.accidental === "b" && note.accidental === "#") {
        const noteIndex = ScaleHelper.chromatic
          .notes.findIndex(c => { 
            return c.note === note.note && c.accidental === note.accidental 
          });
        resultNotes.push({ 
          note: ScaleHelper.chromatic.notes[noteIndex + 1].note, accidental: "b"
        });
      } else {
        resultNotes.push(note);
      }
    });
    return resultNotes;
  }
} 
