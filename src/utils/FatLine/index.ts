import * as THREE from "three";
// @ts-ignore
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";
// @ts-ignore
import { Line2 } from "three/examples/jsm/lines/Line2";
// @ts-ignore
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
import { Component } from "../../base-types/component";
import {
  Configurable,
  Disposable,
  Hideable,
  Event,
} from "../../base-types/base-types";
import { Simple2DMarker } from "../../core/Simple2DMarker";
import { Components } from "../../core/Components";

export interface FatLineConfig {
  startPoint: THREE.Vector3;
  endPoint: THREE.Vector3;
  addToScene?: boolean;
  width?: number;
  color?: THREE.ColorRepresentation;
  includeMarkers?: boolean;
}

const defaultFatLineConfig: Required<FatLineConfig> = {
  startPoint: new THREE.Vector3(),
  endPoint: new THREE.Vector3(0, 10, 0),
  color: 0xbcf124,
  width: 3,
  addToScene: true,
  includeMarkers: false,
};

export class FatLine
  extends Component<Line2 | null>
  implements Configurable<FatLineConfig>, Disposable, Hideable
{
  enabled = false;
  private _line: Line2 | null = null;

  set width(value: number) {
    if (!this._line) {
      return;
    }
    this._line.material.linewidth = value;
  }

  get width() {
    if (!this._line) {
      return 0;
    }
    return this._line.material.linewidth;
  }

  set color(value: THREE.ColorRepresentation) {
    if (!this._line) {
      return;
    }
    this._line.material.color.copy(new THREE.Color(value));
    if (this.startMarker && this.endMarker) {
      const color = this._line.material.color.getStyle();
      this.startMarker.get().element.style.backgroundColor = color;
      this.endMarker.get().element.style.backgroundColor = color;
    }
  }

  get color() {
    if (!this._line) {
      return this.config.color;
    }
    return this._line.material.color;
  }

  startMarker: Simple2DMarker | null = null;
  private _startPoint = new THREE.Vector3();
  readonly onStartPointChanged = new Event<THREE.Vector3>();

  set startPoint(value: THREE.Vector3) {
    if (!this._line) {
      return;
    }
    this._startPoint = value;
    this._line.geometry.setPositions([
      value.x,
      value.y,
      value.z,
      this._endPoint.x,
      this._endPoint.y,
      this._endPoint.z,
    ]);
    if (this.startMarker) {
      this.startMarker.get().position.copy(value);
    }
    this.onStartPointChanged.trigger(value);
  }

  get startPoint() {
    return this._startPoint;
  }

  endMarker: Simple2DMarker | null = null;
  private _endPoint = new THREE.Vector3();
  readonly onEndPointChanged = new Event<THREE.Vector3>();

  set endPoint(value: THREE.Vector3) {
    if (!this._line) {
      return;
    }
    this._endPoint = value;
    this._line.geometry.setPositions([
      this._startPoint.x,
      this._startPoint.y,
      this._startPoint.z,
      value.x,
      value.y,
      value.z,
    ]);
    if (this.endMarker) {
      this.endMarker.get().position.copy(value);
    }
    this.onStartPointChanged.trigger(value);
  }

  get endPoint() {
    return this._endPoint;
  }

  get center() {
    return this._endPoint.clone().add(this._startPoint).multiplyScalar(0.5);
  }

  get length() {
    return this._endPoint.clone().sub(this._startPoint.clone()).length();
  }

  constructor(components: Components) {
    super(components);
  }

  readonly onDisposed = new Event();

  config = defaultFatLineConfig;

  readonly onSetup = new Event();

  async setup(config?: Partial<FatLineConfig>) {
    await this.dispose();
    this.config = { ...this.config, ...config };
    const { startPoint, endPoint, color, width, addToScene, includeMarkers } =
      this.config;
    const lineGeometry = new LineGeometry();
    const lineMaterial = new LineMaterial();
    this._line = new Line2(lineGeometry, lineMaterial);
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.width = width;
    this.color = color;
    this.setMaterialResolution();
    const renderer = this.components.renderer;
    renderer.onResize.add(this.setMaterialResolution);
    // if (renderer instanceof PostproductionRenderer) {
    //   const postproduction = renderer.postproduction
    //   postproduction.customEffects.excludedMeshes.push(this._line)
    // }
    if (addToScene) {
      this.components.scene.get().add(this._line);
    }
    if (includeMarkers) {
      this.createMarkers();
    }
    this.enabled = true;
    this.onSetup.trigger();
  }

  private createMarkers() {
    if (!this._line) {
      return;
    }
    const startMarkerHTML = this.createMarkerHTML();
    const endMarkerHTML = this.createMarkerHTML();
    if (!(startMarkerHTML && endMarkerHTML)) {
      return;
    }
    this.startMarker = new Simple2DMarker(this.components, startMarkerHTML);
    this.startMarker.get().position.copy(this._startPoint);
    this.endMarker = new Simple2DMarker(this.components, endMarkerHTML);
    this.endMarker.get().position.copy(this._endPoint);
  }

  private createMarkerHTML() {
    if (!this._line) {
      return null;
    }
    const marker = document.createElement("div");
    marker.style.backgroundColor = this._line.material.color.getStyle();
    marker.style.width = "9px";
    marker.style.height = "9px";
    marker.style.borderRadius = "100%";
    marker.style.position = "absolute";
    marker.style.top = "0";
    return marker;
  }

  private setMaterialResolution = () => {
    if (!this._line) {
      return;
    }
    const size = this.components.renderer.getSize();
    this._line.material.resolution.set(size.x, size.y);
  };

  set visible(value: boolean) {
    if (this._line) {
      this._line.visible = value;
    }
    if (this.startMarker && this.endMarker) {
      this.startMarker.visible = value;
      this.endMarker.visible = value;
    }
  }

  get visible() {
    if (!this._line) {
      return false;
    }
    return this._line.visible;
  }

  async dispose() {
    if (!this._line) {
      return;
    }
    this.config = defaultFatLineConfig;
    this._line.geometry.dispose();
    this._line.material.dispose();
    this.components.renderer.onResize.remove(this.setMaterialResolution);
    this._line = null;
    if (this.startMarker && this.endMarker) {
      this.startMarker.dispose();
      this.endMarker.dispose();
    }
    this.enabled = false;
    this.onDisposed.trigger();
  }

  get() {
    return this._line;
  }
}
