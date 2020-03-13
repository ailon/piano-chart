import { Key } from './Key';
import { G, Rect } from '@svgdotjs/svg.js';
import { PianoData } from './PianoData';
import { Note, INoteValue, NoteValue } from "./Note";
import { KeyEventHandler } from './PianoElement';
import { InstrumentSettings } from './InstrumentSettings';

export class WhiteKey extends Key {
  constructor(container: G, instrumentSettings: InstrumentSettings, onKeyPress: KeyEventHandler, onKeyRelease: KeyEventHandler, note: NoteValue, width: number) {
    super(container, instrumentSettings, onKeyPress, onKeyRelease, width, width * PianoData.WHITE_KEY_RATIO, note);
  }

  public create() {
    this._visual = this.container.rect(this.width, this.height)
      .fill("#fff")
      .stroke({
        color: "#000",
        width: 2
      });
    
    this.createLabel("#000");
    this.createHighlight(this.width / PianoData.WHITE_BLACK_WIDTH_RATIO / 8);

    this.addMouseListeners();
  }

  public resize(width: number) {
    this.width = width;
    this.height = width * PianoData.WHITE_KEY_RATIO
    this.layout();
  }

  public press(displayNote: INoteValue) {
    var gradient = this.container.gradient('linear', function(add) {
      add.stop(0, '#fff')
      add.stop(1, '#e8e8e8')
    });
    gradient.attr({ x1: 0, y1: 0, x2: 0, y2: 1});

    if (!this.isPressed) {
      super.press(displayNote);

      this._visual?.fill(gradient).transform({
        origin: { x: this.width / 2, y: 0 },
        skewX: 0.3
      });
    }
  }

  public release() {
    if (this.isPressed) {
      super.release();

      this._visual?.fill("#fff").untransform();
    }
  }
}