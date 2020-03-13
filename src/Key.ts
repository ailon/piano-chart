import { G, Rect, Text, Circle } from '@svgdotjs/svg.js';
import { PianoElement, KeyEventHandler } from './PianoElement';
import { INoteValue, NoteValue } from './Note';
import { InstrumentSettings } from './InstrumentSettings';

export class Key extends PianoElement {
  private _note: NoteValue;
  public get note() {
    return this._note;
  }
  private displayNote: INoteValue;

  protected _visual?: Rect;

  protected _label?: G;
  protected _labelText?: Text;

  protected _highlight?: Circle;
  protected highlightSize: number = 1;

  protected width: number;
  protected height: number;

  protected isPressed = false;
  protected get isHighlighted(): boolean {
    const thisNote = this.note.baseNote !== undefined ? this.note.baseNote : this.note;
    return this.instrumentSettings.highlightedNotes.findIndex(highlightedNote => {
      return (
        highlightedNote.note === thisNote.note
        && highlightedNote.accidental === thisNote.accidental
        && (highlightedNote.octave === thisNote.octave || highlightedNote.octave === undefined)
      );
    }) > -1 || this.isSpecialHighlighted;
  }
  protected get isSpecialHighlighted(): boolean {
    const thisNote = this.note.baseNote !== undefined ? this.note.baseNote : this.note;
    return this.instrumentSettings.specialHighlightedNotes.findIndex(highlightedNote => {
      const hBaseNote = highlightedNote.baseNote !== undefined ? highlightedNote.baseNote : highlightedNote;
      return (
        hBaseNote.note === thisNote.note
        && hBaseNote.accidental === thisNote.accidental
        && (hBaseNote.octave === thisNote.octave || hBaseNote.octave === undefined)
      );
    }) > -1;
  }

  constructor(
    container: G, 
    instrumentSettings: InstrumentSettings,
    onKeyPress: KeyEventHandler, 
    onKeyRelease: KeyEventHandler, 
    width: number, 
    height: number, 
    note: NoteValue
  ) {
    super(container, instrumentSettings, onKeyPress, onKeyRelease);
    
    this.width = width;
    this.height = height;

    this._note = note;
    this.displayNote = note;
  }

  protected addMouseListeners() {
    if (this._visual !== undefined) {
      this._visual.on('mousedown', () => { 
        if (this.onKeyPress !== undefined) {
          this.onKeyPress(this.note);
        }
       });
      this._visual.on('mouseup', () => { 
        if (this.onKeyRelease !== undefined) {
          this.onKeyRelease(this.note);
        }
       });
    }
  }

  public press(displayNote: INoteValue) {
    this.isPressed = true;
    this.displayNote = displayNote;
    if (this._label && this.instrumentSettings.showNoteNames === "onpress") {
      this.updateLabel();
      this._label.show();
    }
  }

  public release() {
    this.isPressed = false;
    if (this._label && this.instrumentSettings.showNoteNames === "onpress") {
      this._label.hide();
    }
  }

  public backward() {
    this.container.backward();
  }

  protected createLabel(color: string) {
    this._label = this.container.group();
    this._labelText = this._label
      .text(`${this.displayNote.note}${this.displayNote.accidental ? this.displayNote.accidental : ""}`)
      .fill(color)
      .font({
        family:   'Helvetica',
        size:     this.width / 2,
        anchor:   'middle'
      })
      ;
    this._label.attr('pointer-events', 'none');
    this.layout();
    if (this.instrumentSettings.showNoteNames !== "always") {
      this._label.hide();
    }
  }

  protected updateLabel() {
    if (this._labelText) {
      this._labelText.text(`${this.displayNote.note}${this.displayNote.accidental ? this.displayNote.accidental : ""}`)
      this.layout();
    }
  }

  protected createHighlight(size: number) {
    this.highlightSize = size;
    this._highlight = this.container.circle(this.highlightSize);
    this._highlight.center(0.5, 0.5);
    this._highlight.attr('pointer-events', 'none');

    const highlightColor = this.instrumentSettings.highlightColor;
    const specialHighlightColor = this.instrumentSettings.specialHighlightColor;
    let highlightGradient = this.container.gradient('radial', function(add) {
      add.stop(0, '#fff')
      add.stop(1, highlightColor)
    });
    highlightGradient.attr({ cx: 0.4, cy: 0.4 });
    
    let specialHighlightGradient = this.container.gradient('radial', function(add) {
      add.stop(0, '#fff')
      add.stop(1, specialHighlightColor)
    });
    specialHighlightGradient.attr({ cx: 0.4, cy: 0.4 });

    this._highlight.fill(
      this.isSpecialHighlighted ? 
        specialHighlightGradient :
        highlightGradient
    );

    this.layout();
  }

  protected layout() {
    this._visual?.size(this.width, this.height);
    if (this._label && this._labelText) {
      this._labelText.font({ size: this.width / 2 });
      this._label?.untransform();
      this._label?.translate(
        this.width / 2, 
        this.height - this._labelText.bbox().height * 2
      );
      if (this.instrumentSettings.showNoteNames === "onhighlight") {
        if (this.isHighlighted) {
          this._label.show();
        } else {
          this._label.hide();
        }
      }
    }

    if (this._highlight) {
      this._highlight.radius(this.highlightSize)
        .untransform()
        .translate(this.width / 2, this.highlightSize * 4);
      if (this.isHighlighted) {
        this._highlight.show();
      } else {
        this._highlight.hide();
      }
    }
  }
}