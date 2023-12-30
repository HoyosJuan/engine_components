import * as THREE from "three";
import { Component } from "../../base-types/component";
import { Configurable, Event } from "../../base-types/base-types";
import { Components } from "../../core/Components";
import { AnimatedLineMaterial } from "./src/AnimatedLineMaterial";

export interface AnimatedDashedLineConfig {
  startPoint: THREE.Vector3;
  endPoint: THREE.Vector3;
  color?: THREE.ColorRepresentation;
  addToScene: boolean;
}

export class AnimatedDashedLine
  extends Component<THREE.Line | null>
  implements Configurable<AnimatedDashedLineConfig>
{
  enabled = true;
  private _line: THREE.Line | null = null;

  constructor(components: Components) {
    super(components);
  }

  config: Required<AnimatedDashedLineConfig> = {
    startPoint: new THREE.Vector3(),
    endPoint: new THREE.Vector3(0, 10, 0),
    color: "yellow",
    addToScene: true,
  };

  readonly onSetup = new Event();

  async setup(config?: Partial<AnimatedDashedLineConfig>) {
    this.config = { ...this.config, ...config };
    const { startPoint, endPoint, color } = this.config;
    const geometry = new THREE.BufferGeometry().setFromPoints([
      startPoint,
      endPoint,
    ]);
    geometry.setAttribute(
      "lineDistance",
      new THREE.Float32BufferAttribute([1, 10], 1)
    );
    const material = new AnimatedLineMaterial(color);
    this._line = new THREE.Line(geometry, material);
    const renderer = this.components.renderer;
    if (renderer.isUpdateable()) {
      const clock = new THREE.Clock();
      let time = 0;
      renderer.onAfterUpdate.add(() => {
        time += clock.getDelta();
        material.uniforms.time.value = time;
      });
    }
    if (this.config.addToScene) {
      this.components.scene.get().add(this._line);
    }
    this.onSetup.trigger();
  }

  get() {
    return this._line;
  }
}
