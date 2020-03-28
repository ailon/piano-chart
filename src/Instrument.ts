import { SVG, Svg, G, Rect } from "@svgdotjs/svg.js";
import { Keybed } from './Keybed';
import { IInstrumentSettings, InstrumentSettings } from './InstrumentSettings';
import { Note, INoteValue, NoteValue } from './Note';
import { KeyEventHandler } from './PianoElement';

export class Instrument {
  private settings: InstrumentSettings;

  private container: HTMLElement;

  private img?: Svg;

  private keybed?: Keybed;

  private keyPressEventHandlers: KeyEventHandler[] = [];
  private keyReleaseEventHandlers: KeyEventHandler[] = [];

  constructor(
    container: HTMLElement,
    settings?: IInstrumentSettings
    ) {
    this.container = container;

    this.settings = new InstrumentSettings(settings);

    this.create = this.create.bind(this);
    this.layout = this.layout.bind(this);
    this.keyDown = this.keyDown.bind(this);
    this.keyUp = this.keyUp.bind(this);
    this.destroy = this.destroy.bind(this);
    this.handleMouseKeyDown = this.handleMouseKeyDown.bind(this);
    this.handleMouseKeyUp = this.handleMouseKeyUp.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.reload = this.reload.bind(this);
  }

  public create() {
    this.img = SVG().addTo(this.container).size("100%", "100%");

    // disable text selection
    this.img.css('-ms-user-select', 'none');
    this.img.css('-webkit-user-select', 'none');
    this.img.css('-moz-user-select', 'none');
    this.img.css('user-select', 'none');
    
    this.keybed = new Keybed(
      this.img.group(), 
      this.handleMouseKeyDown,
      this.handleMouseKeyUp,
      this.container.clientWidth,
      this.container.clientHeight,
      this.settings
      );
    this.keybed.create();

    this.layout();

    window.addEventListener("resize", this.handleResize);
  }

  public destroy() {
    this.container.removeChild(this.img.node);
    window.removeEventListener("resize", this.handleResize);
  }

  public keyDown(note: INoteValue | string) {
    if (this.keybed) {
      this.keybed.keyDown(new NoteValue(note));
    }
  }
  public keyUp(note:  INoteValue | string) {
    if (this.keybed) {
      this.keybed.keyUp(new NoteValue(note));
    }
  }

  public addKeyMouseDownListener(handler: KeyEventHandler) {
    this.keyPressEventHandlers.push(handler);
  }

  public addKeyMouseUpListener(handler: KeyEventHandler) {
    this.keyReleaseEventHandlers.push(handler);
  }

  public removeKeyMouseDownListener(handler?: KeyEventHandler) {
    if (handler !== undefined) {
      if (this.keyPressEventHandlers.indexOf(handler) > -1) {
        this.keyPressEventHandlers.splice(this.keyPressEventHandlers.indexOf(handler), 1);
      }
    } else {
      this.keyPressEventHandlers.splice(0);
    }
  }

  public removeKeyMouseUpListener(handler?: KeyEventHandler) {
    if (handler !== undefined) {
      if (this.keyReleaseEventHandlers.indexOf(handler) > -1) {
        this.keyReleaseEventHandlers.splice(this.keyReleaseEventHandlers.indexOf(handler), 1);
      }
    } else {
      this.keyReleaseEventHandlers.splice(0);
    }
  }

  public reload() {
    this.destroy();
    this.create();
  }

  public applySettings(settings: IInstrumentSettings) {
    this.settings.applySettings(settings);
    if (this.settings.reloadNeded) {
      this.reload();
    } else {
      if (this.keybed) {
        this.keybed.setInstrumentSettings(this.settings);
      }
      this.layout();
    }
  }

  private resizeCounter = 0;
  private handleResize() {
    this.resizeCounter++;
    setTimeout(() => {
      this.resizeCounter--;
      if (this.resizeCounter <= 0) {
        this.layout();
      }
    }, 300)
  }

  private layout() {
    if (this.img && this.keybed) {

      this.img.size('100%', '100%');
      
      this.keybed.layout(
        this.container.clientWidth,
        this.container.clientHeight
      );

      this.img
        .width(this.keybed.boxWidth)
        .height(this.keybed.boxHeight);
    }
  }

  private handleMouseKeyDown(note: INoteValue) {
    this.keyPressEventHandlers.forEach(handler => handler(note));
  }
  private handleMouseKeyUp(note: INoteValue) {
    this.keyReleaseEventHandlers.forEach(handler => handler(note));
  }
}