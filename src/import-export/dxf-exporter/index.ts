import Drawing from "dxf-writer";
import * as THREE from "three";
import { FragmentManager, FragmentPlans } from "../../fragments";
import { EdgesClipper } from "../../navigation";
import { EdgeProjector } from "./src/edge-projector";

export class DXFExporter {
  _fragments: FragmentManager;
  _plans: FragmentPlans;
  _clipper: EdgesClipper;

  precission = 0.001;

  private _projector = new EdgeProjector();

  constructor(
    fragments: FragmentManager,
    plans: FragmentPlans,
    clipper: EdgesClipper
  ) {
    this._fragments = fragments;
    this._plans = plans;
    this._clipper = clipper;
  }

  async export(name: string) {
    const drawing = new Drawing();
    drawing.setUnits("Meters");

    // Draw projected lines

    const plans = this._plans.get();
    const plan = plans.find((plan) => plan.name === name);
    if (!plan || !plan.plane) {
      throw new Error("Plan doesn't exist!");
    }

    const meshes = Object.values(this._fragments.list).map((frag) => frag.mesh);
    let height = plan.point.y;
    if (plan.offset) {
      height += plan.offset;
    }

    drawing.addLayer("projection", Drawing.ACI.BLUE, "CONTINUOUS");
    drawing.setActiveLayer("projection");

    const projectedLines = await this._projector.project(meshes, height);
    this.drawGeometry(projectedLines.geometry, drawing);

    // Draw section lines

    drawing.addLayer("section", Drawing.ACI.RED, "CONTINUOUS");
    drawing.setActiveLayer("section");

    const edges = plan.plane.edges.get();

    for (const layerName in edges) {
      const geometry = edges[layerName].mesh.geometry;
      this.drawGeometry(geometry, drawing);
    }

    return drawing.toDxfString();
  }

  private drawGeometry(geometry: THREE.BufferGeometry, drawing: Drawing) {
    const pos = geometry.attributes.position.array;
    const range = Math.min(geometry.drawRange.count * 3, pos.length);
    for (let i = 0; i < range; i += 6) {
      const x1 = pos[i];
      const y1 = pos[i + 2];
      const x2 = pos[i + 3];
      const y2 = pos[i + 5];
      const diffX = Math.abs(x2 - x1);
      const diffY = Math.abs(y2 - y1);
      const approxDistance = diffX + diffY;
      if (approxDistance > this.precission) {
        drawing.drawLine(x1, y1, x2, y2);
      }
    }
  }
}
