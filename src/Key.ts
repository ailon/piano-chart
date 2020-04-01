import { G, Rect, Text, Circle } from '@svgdotjs/svg.js';
import { PianoElement, KeyEventHandler } from './PianoElement';
import { INoteValue, NoteValue, Accidetnal } from './Note';
import { InstrumentSettings } from './InstrumentSettings';

export class Key extends PianoElement {
  private _note: NoteValue;
  public get note() {
    return this._note;
  }
  private _displayNote: INoteValue;
  private get displayNote(): INoteValue {
    if (this.isHighlighted) {
      return this.getNoteIfHighlighted([...this.instrumentSettings.highlightedNotes, ...this.instrumentSettings.specialHighlightedNotes]);
    } else {
      return this._displayNote;
    }
  }

  protected _visual?: Rect;

  protected _label?: G;
  protected _labelText?: Text;

  protected _highlight?: Circle;
  protected highlightSize: number = 1;

  protected width: number;
  protected height: number;

  protected isPressed = false;
  protected get isHighlighted(): boolean {
    return this.getNoteIfHighlighted(this.instrumentSettings.highlightedNotes) !== undefined || this.isSpecialHighlighted;
  }
  protected get isSpecialHighlighted(): boolean {
    return this.getNoteIfHighlighted(this.instrumentSettings.specialHighlightedNotes) !== undefined;
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
    this._displayNote = note;

    this.addMouseListeners = this.addMouseListeners.bind(this);
    this.handleInputDown = this.handleInputDown.bind(this);
    this.handleInputUp = this.handleInputUp.bind(this);
  }

  protected addMouseListeners() {
    if (this._visual !== undefined) {
      this._visual.on('mousedown', this.handleInputDown);
      this._visual.on('mouseup', this.handleInputUp);
      this._visual.on('mouseleave', this.handleInputUp);

      this._visual.on('touchstart', this.handleInputDown);
      this._visual.on('touchend', this.handleInputUp);
    }
  }

  private isMouseDown = false; // separate from isPressed as that one is set externally
  private handleInputDown() {
    this.isMouseDown = true;
    if (this.onKeyPress !== undefined) {
      this.onKeyPress(this.note);
    }
  }

  private handleInputUp() {
    if (this.isMouseDown) {
      this.isMouseDown = false;
      if (this.onKeyRelease !== undefined) {
        this.onKeyRelease(this.note);
      }
    }
  }

  public press(displayNote: INoteValue) {
    this.isPressed = true;
    this._displayNote = displayNote;
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

  private accidentalToUnicode(accidental: Accidetnal) {
    return accidental.toString().replace(/#/g, '♯').replace(/b/g, '♭');
  }

  protected createLabel(color: string) {
    this._label = this.container.group();
    this._labelText = this._label
      .text(`${this.displayNote.note}${this.displayNote.accidental ? this.accidentalToUnicode(this.displayNote.accidental) : ""}`)
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
      this._labelText.text(`${this.displayNote.note}${this.displayNote.accidental ? this.accidentalToUnicode(this.displayNote.accidental) : ""}`)
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

  private getNoteIfHighlighted(highlightedNotes: NoteValue[]): NoteValue | undefined {
    const thisNote = this.note.baseNote !== undefined ? this.note.baseNote : this.note;
    return highlightedNotes.find(highlightedNote => {
      const hBaseNote = highlightedNote.baseNote !== undefined ? highlightedNote.baseNote : highlightedNote;
      return (
        hBaseNote.note === thisNote.note
        && hBaseNote.accidental === thisNote.accidental
        && (hBaseNote.octave === thisNote.octave || hBaseNote.octave === undefined)
      );
    });
  }

}