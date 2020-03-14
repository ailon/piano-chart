import { G } from '@svgdotjs/svg.js';
import { Note, INoteValue, NoteValue } from "./Note";
import { PianoData } from './PianoData';
import { Octave } from './Octave';
import { PianoElement, KeyEventHandler } from './PianoElement';
import { InstrumentSettings } from './InstrumentSettings';

export class Keybed extends PianoElement {
  private availableWidth: number; 
  private availableHeight: number;

  private octaves: Octave[] = [];

  constructor(
    container: G, 
    onKeyPress: KeyEventHandler, 
    onKeyRelease: KeyEventHandler, 
    availableWidth: number, 
    availableHeight: number,
    instrumentSettings: InstrumentSettings
  ) {
    super(container, instrumentSettings, onKeyPress, onKeyRelease);

    this.availableWidth = availableWidth; 
    this.availableHeight = availableHeight;

    this.instrumentSettings = instrumentSettings;
  }

  public create() {
    let offset = 0;
    for (let octaveNo = this.instrumentSettings.startOctave; octaveNo <= this.instrumentSettings.endOctave; octaveNo++) {
      const octave = new Octave(
        this.container.group(), 
        this.instrumentSettings,
        this.onKeyPress,
        this.onKeyRelease,
        octaveNo,
        octaveNo === this.instrumentSettings.startOctave ? this.instrumentSettings.startNote : "C",
        octaveNo === this.instrumentSettings.endOctave ? this.instrumentSettings.endNote : "B",
        this.whiteKeyWidth
      );
      octave.create();
      this.octaves.push(octave);
    }
  }

  public layout(availableWidth: number, availableHeight: number) {
    this.availableWidth = availableWidth;
    this.availableHeight = availableHeight;

    let offset = 0;
    this.octaves.forEach(octave => {
      octave.layout(this.whiteKeyWidth);
      octave.move(offset, 0);
      offset += octave.boxWidth;
    })
  }

  public get numberOfWhiteKeys(): number {
    let result = 0;

    const noteList = PianoData.NOTE_LIST;

    for (let octave = this.instrumentSettings.startOctave; octave <= this.instrumentSettings.endOctave; octave++) {
      if (octave === this.instrumentSettings.startOctave) {
        if (this.instrumentSettings.endOctave > this.instrumentSettings.startOctave) {
          result += 7 - noteList.indexOf(this.instrumentSettings.startNote);
        } else {
          // just one octave
          result = noteList.indexOf(this.instrumentSettings.endNote) - noteList.indexOf(this.instrumentSettings.startNote) + 1;
        }
      } else if (octave === this.instrumentSettings.endOctave) {
        result += noteList.indexOf(this.instrumentSettings.endNote) + 1;
      } else {
        result += 7;
      }
    }

    return result;
  }

  public get whiteKeyWidth() {
    const fullWidth = this.availableWidth / this.numberOfWhiteKeys
    if (fullWidth * PianoData.WHITE_KEY_RATIO <= this.availableHeight) {
      return fullWidth;
    } else {
      return this.availableHeight / PianoData.WHITE_KEY_RATIO;
    }
  }

  public keyDown(note: INoteValue) {
    if (this.octaves.length > 0 
      && note.octave !== undefined 
    ) {
      const noteObject = new NoteValue(note);
      const noteOctave = this.octaves.find(o => o.octave === noteObject.baseNote.octave);
      if (noteOctave) {
        noteOctave.keyDown(note);
      }
    }
  }
  public keyUp(note: INoteValue) {
    if (this.octaves.length > 0 
      && note.octave !== undefined 
    ) {
      const noteOctave = this.octaves.find(o => o.octave === note.octave);
      if (noteOctave) {
        noteOctave.keyUp(note);
      }
    }
  }

  public setInstrumentSettings(settings: InstrumentSettings) {
    super.setInstrumentSettings(settings);
    this.octaves.forEach(octave => octave.setInstrumentSettings(settings));
  }
}