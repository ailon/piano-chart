import { Note, INoteValue } from "./Note";
import { G, Text } from '@svgdotjs/svg.js';
import { PianoData } from './PianoData';
import { WhiteKey } from './WhiteKey';
import { BlackKey } from './BlackKey';
import { PianoElement, KeyEventHandler } from './PianoElement';
import { InstrumentSettings } from './InstrumentSettings';

export class Octave extends PianoElement {
  private _octave: number;
  public get octave() {
    return this._octave;
  }
  private startNote: Note;
  private endNote: Note;

  private whiteKeyWidth: number;
  private whiteKeyHeight: number;

  private whiteKeys: WhiteKey[] = [];
  private blackKeys: BlackKey[] = [];

  private _label?: G;
  private _labelText?: Text;
  private readonly LABEL_SIZE_RATIO = 30;
  

  constructor(
    container: G, 
    instrumentSettings: InstrumentSettings,
    onKeyPress: KeyEventHandler, 
    onKeyRelease: KeyEventHandler, 
    octave: number, 
    startNote: Note, 
    endNote: Note, 
    whiteKeyWidth: number
  ) {
    super(container, instrumentSettings, onKeyPress, onKeyRelease);

    this.container = container;
    this._octave = octave;
    this.startNote = startNote;
    this.endNote = endNote;
    this.whiteKeyWidth = whiteKeyWidth;
    this.whiteKeyHeight = this.whiteKeyWidth * PianoData.WHITE_KEY_RATIO;
  }

  public create() {
    let offset = 0;
    let moveNextWhiteBack = false;
    for (
      let wki = PianoData.NOTE_LIST.indexOf(this.startNote); 
        wki <= PianoData.NOTE_LIST.indexOf(this.endNote); 
        wki++
    ) {
      const note = PianoData.NOTE_LIST[wki];
      let wk = new WhiteKey(
        this.container.group(), 
        this.instrumentSettings, 
        this.onKeyPress, 
        this.onKeyRelease, 
        { note: note, octave: this._octave }, 
        this.whiteKeyWidth
      );
      wk.create();
      this.whiteKeys.push(wk);
      if (moveNextWhiteBack) {
        wk.backward();
      }
      moveNextWhiteBack = false;

      if (
        PianoData.BLACK_BASE_NOTE_LIST.indexOf(note) > -1
        && !(note === this.endNote && this.endNote !== "B")
      ) {
        let bk = new BlackKey(
          this.container.group(), 
          this.instrumentSettings,
          this.onKeyPress,
          this.onKeyRelease,
          { note: note, accidental: "#", octave: this._octave }, 
          wk,
          this.whiteKeyWidth / PianoData.WHITE_BLACK_WIDTH_RATIO
        );
        bk.create();
        this.blackKeys.push(bk);
        moveNextWhiteBack = true;
      }
    }

    this.createOctaveNumberLabel();
  }
  
  public layout(whiteKeyWidth: number) {
    this.whiteKeyWidth = whiteKeyWidth;
    this.whiteKeyHeight = this.whiteKeyWidth * PianoData.WHITE_KEY_RATIO;

    let offset = 0;
    this.whiteKeys.forEach(wk => {
      wk.resize(this.whiteKeyWidth);
      wk.move(offset, 0);
      offset += wk.boxWidth; 
      const bk = this.blackKeys.find(b => b.baseWhiteKey === wk);
      if (bk) {
        bk.resize(this.whiteKeyWidth / PianoData.WHITE_BLACK_WIDTH_RATIO);
        bk.move(offset - bk.boxWidth / 2, 0);
      }
    });

    if (this._label && this._labelText) {
      this._labelText.font({ size: this.whiteKeyHeight / this.LABEL_SIZE_RATIO });
      this._label?.untransform();
      this._label?.translate(
        this.whiteKeyHeight / this.LABEL_SIZE_RATIO / 2, 
        this.whiteKeyHeight - this._labelText.bbox().height * 1.5
      );
      if (this.instrumentSettings.showOctaveNumbers) {
        this._label.show();
      } else {
        this._label.hide();
      }
    }
  }

  public get numberOfWhiteKeys() {
    return PianoData.NOTE_LIST.indexOf(this.endNote) - PianoData.NOTE_LIST.indexOf(this.startNote) + 1;
  }

  public keyDown(note: INoteValue) {
    if (note.accidental === undefined) {
      const key = this.whiteKeys.find(wk => wk.note.note === note.note);
      if (key) {
        key.press();
      }
    } else if (note.accidental === "#") {
      const key = this.blackKeys.find(bk => bk.note.note === note.note);
      if (key) {
        key.press();
      }
    }
  }
  public keyUp(note: INoteValue) {
    if (note.accidental === undefined) {
      const key = this.whiteKeys.find(wk => wk.note.note === note.note);
      if (key) {
        key.release();
      }
    } else if (note.accidental === "#") {
      const key = this.blackKeys.find(bk => bk.note.note === note.note);
      if (key) {
        key.release();
      }
    }
  }

  public setInstrumentSettings(settings: InstrumentSettings) {
    super.setInstrumentSettings(settings);
    this.whiteKeys.forEach(key => key.setInstrumentSettings(settings));
    this.blackKeys.forEach(key => key.setInstrumentSettings(settings));
  }

  private createOctaveNumberLabel() {
    this._label = this.container.group();
    this._labelText = this._label
      .text(`${this.octave}`)
      .fill('#000')
      .font({
        family:   'Helvetica',
        size:     this.whiteKeyHeight / this.LABEL_SIZE_RATIO,
        anchor:   'left'
      })
      ;
    this._label.attr('pointer-events', 'none');
  }
}