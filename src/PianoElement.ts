import { G } from '@svgdotjs/svg.js';
import { INoteValue } from './Note';
import { InstrumentSettings } from './InstrumentSettings';

export type KeyEventHandler = (note: INoteValue) => void;

export class PianoElement {
  protected container: G;
  protected onKeyPress: KeyEventHandler;
  protected onKeyRelease: KeyEventHandler;

  protected instrumentSettings: InstrumentSettings;

  constructor(
    container: G, 
    instrumentSettings: InstrumentSettings, 
    onKeyPress: KeyEventHandler, 
    onKeyRelease: KeyEventHandler
  ) {
    this.container = container;
    this.onKeyPress = onKeyPress;
    this.onKeyRelease = onKeyRelease;
    this.instrumentSettings = instrumentSettings;
  }

  public get boxWidth() {
    return this.container.bbox().width;
  }

  public get boxHeight() {
    return this.container.bbox().height;
  }
 
  public move(x: number, y: number) {
    this.container.untransform();
    this.container.translate(x, y);
  }

  public setInstrumentSettings(settings: InstrumentSettings) {
    this.instrumentSettings = settings;
  }
}