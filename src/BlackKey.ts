import { Key } from './Key';
import { G, SVG, Gradient, Color } from '@svgdotjs/svg.js';
import { PianoData } from './PianoData';
import { Note, INoteValue, NoteValue } from "./Note";
import { WhiteKey } from './WhiteKey';
import { KeyEventHandler } from './PianoElement';
import { InstrumentSettings } from './InstrumentSettings';

export class BlackKey extends Key {
  private _baseWhiteKey: WhiteKey;
  public get baseWhiteKey() {
    return this._baseWhiteKey;
  }

  constructor(container: G, instrumentSettings: InstrumentSettings, onKeyPress: KeyEventHandler, onKeyRelease: KeyEventHandler, note: NoteValue, baseWhiteKey: WhiteKey, width: number) {
    super(container, instrumentSettings, onKeyPress, onKeyRelease, width, width * PianoData.BLACK_KEY_RATIO, note);
    this._baseWhiteKey = baseWhiteKey;
  }

  public create() {
    this._visual = this.container.rect(this.width, this.height)
      .fill("#000")      
      .stroke({
        color: "#000",
        width: 2
      });

    this.createLabel("#fff");
    this.createHighlight(this.width / 8);

    this.addMouseListeners();
  }

  public resize(width: number) {
    this.width = width;
    this.height = width * PianoData.BLACK_KEY_RATIO
    this.layout();
  }

  public press(displayNote: INoteValue) {
    let keyFill: Color | Gradient;

    if (this.instrumentSettings.keyPressStyle === "subtle") {
      keyFill = this.container.gradient('linear', function(add) {
        add.stop(0, '#000')
        add.stop(1, '#555')
      });
      keyFill.attr({ x1: 0, y1: 0, x2: 0, y2: 1});
    } else {
      keyFill = new Color(this.instrumentSettings.vividKeyPressColor);
      keyFill = keyFill.hsl();
      // slightly darker shade
      keyFill.l /= 1.2;
    }

    if (!this.isPressed) {
      super.press(displayNote);

      this._visual?.fill(keyFill as unknown);
    }
  }

  public release() {
    if (this.isPressed) {
      super.release();

      this._visual?.fill("#000");
    }
  }

}