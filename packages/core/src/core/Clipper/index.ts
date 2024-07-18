import * as THREE from "three";
import {
  Component,
  Createable,
  Disposable,
  Event,
  Hideable,
  World,
} from "../Types";
import { SimplePlane } from "./src";
import { Components } from "../Components";
import { Raycasters } from "../Raycasters";
import { Worlds } from "../Worlds";

export * from "./src";

/**
 * A lightweight component to easily create, delete and handle [clipping planes](https://threejs.org/docs/#api/en/materials/Material.clippingPlanes). 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Core/Clipper). 📘 [API](https://docs.thatopen.com/api/@thatopen/components/classes/Clipper).
 *
 * @param components - the instance of {@link Components} used.
 * E.g. {@link SimplePlane}.
 */
export class Clipper
  extends Component
  implements Createable, Disposable, Hideable
{
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "66290bc5-18c4-4cd1-9379-2e17a0617611" as const;

  /** Event that fires when the user starts dragging a clipping plane. */
  readonly onBeforeDrag = new Event<void>();

  /** Event that fires when the user stops dragging a clipping plane. */
  readonly onAfterDrag = new Event<void>();

  /**
   * Event that fires when the user starts creating a clipping plane.
   */
  readonly onBeforeCreate = new Event();

  /**
   * Event that fires when the user cancels the creation of a clipping plane.
   */
  readonly onBeforeCancel = new Event();

  /**
   * Event that fires after the user cancels the creation of a clipping plane.
   */
  readonly onAfterCancel = new Event();

  /**
   * Event that fires when the user starts deleting a clipping plane.
   */
  readonly onBeforeDelete = new Event();

  /**
   * Event that fires after a clipping plane has been created.
   * @param plane - The newly created clipping plane.
   */
  readonly onAfterCreate = new Event<SimplePlane>();

  /**
   * Event that fires after a clipping plane has been deleted.
   * @param plane - The deleted clipping plane.
   */
  readonly onAfterDelete = new Event<SimplePlane>();

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<string>();

  /**
   * Whether to force the clipping plane to be orthogonal in the Y direction
   * (up). This is desirable when clipping a building horizontally and a
   * clipping plane is created in its roof, which might have a slight
   * slope for draining purposes.
   */
  orthogonalY = false;

  /**
   * The tolerance that determines whether an almost-horizontal clipping plane
   * will be forced to be orthogonal to the Y direction. {@link orthogonalY}
   * has to be `true` for this to apply.
   */
  toleranceOrthogonalY = 0.7;

  /**
   * The type of clipping plane to be created.
   * Default is {@link SimplePlane}.
   */
  Type: new (...args: any) => SimplePlane = SimplePlane;

  /**
   * A list of all the clipping planes created by this component.
   */
  list: SimplePlane[] = [];

  /** The material used in all the clipping planes. */
  private _material = new THREE.MeshBasicMaterial({
    color: 0xbb00ff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.2,
  });

  private _size = 5;
  private _enabled = false;
  private _visible = true;

  /** {@link Component.enabled} */
  get enabled() {
    return this._enabled;
  }

  /** {@link Component.enabled} */
  set enabled(state: boolean) {
    this._enabled = state;
    for (const plane of this.list) {
      plane.enabled = state;
    }
    this.updateMaterialsAndPlanes();
  }

  /** {@link Hideable.visible } */
  get visible() {
    return this._visible;
  }

  /** {@link Hideable.visible } */
  set visible(state: boolean) {
    this._visible = state;
    for (const plane of this.list) {
      plane.visible = state;
    }
  }

  /** The material of the clipping plane representation. */
  get material() {
    return this._material;
  }

  /** The material of the clipping plane representation. */
  set material(material: THREE.MeshBasicMaterial) {
    this._material = material;
    for (const plane of this.list) {
      plane.planeMaterial = material;
    }
  }

  /** The size of the geometric representation of the clippings planes. */
  get size() {
    return this._size;
  }

  /** The size of the geometric representation of the clippings planes. */
  set size(size: number) {
    this._size = size;
    for (const plane of this.list) {
      plane.size = size;
    }
  }

  constructor(components: Components) {
    super(components);
    this.components.add(Clipper.uuid, this);
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this._enabled = false;
    for (const plane of this.list) {
      plane.dispose();
    }
    this.list.length = 0;
    this._material.dispose();
    this.onBeforeCreate.reset();
    this.onBeforeCancel.reset();
    this.onBeforeDelete.reset();
    this.onBeforeDrag.reset();
    this.onAfterCreate.reset();
    this.onAfterCancel.reset();
    this.onAfterDelete.reset();
    this.onAfterDrag.reset();
    this.onDisposed.trigger(Clipper.uuid);
    this.onDisposed.reset();
  }

  /** {@link Createable.create} */
  create(world: World) {
    const casters = this.components.get(Raycasters);
    const caster = casters.get(world);

    const intersects = caster.castRay();
    if (intersects) {
      return this.createPlaneFromIntersection(world, intersects);
    }
    return null;
  }

  /**
   * Creates a plane in a certain place and with a certain orientation,
   * without the need of the mouse.
   *
   * @param world - the world where this plane should be created.
   * @param normal - the orientation of the clipping plane.
   * @param point - the position of the clipping plane.
   * navigation.
   */
  createFromNormalAndCoplanarPoint(
    world: World,
    normal: THREE.Vector3,
    point: THREE.Vector3,
  ) {
    const plane = this.newPlane(world, point, normal);
    this.updateMaterialsAndPlanes();
    return plane;
  }

  /**
   * {@link Createable.delete}
   *
   * @param world - the world where the plane to delete is.
   * @param plane - the plane to delete. If undefined, the first plane
   * found under the cursor will be deleted.
   */
  delete(world: World, plane?: SimplePlane) {
    if (!plane) {
      plane = this.pickPlane(world);
    }
    if (!plane) {
      return;
    }
    this.deletePlane(plane);
  }

  /**
   * Deletes all the existing clipping planes.
   *
   * @param types - the types of planes to be deleted. If not provided, all planes will be deleted.
   */
  deleteAll(types?: Set<string>) {
    const planes = [...this.list];
    for (const plane of planes) {
      if (!types || types.has(plane.type)) {
        this.delete(plane.world, plane);
        const index = this.list.indexOf(plane);
        if (index !== -1) {
          this.list.splice(index, 1);
        }
      }
    }
  }

  private deletePlane(plane: SimplePlane) {
    const index = this.list.indexOf(plane);
    if (index !== -1) {
      this.list.splice(index, 1);
      if (!plane.world.renderer) {
        throw new Error("Renderer not found for this plane's world!");
      }
      plane.world.renderer.setPlane(false, plane.three);
      plane.dispose();
      this.updateMaterialsAndPlanes();
      this.onAfterDelete.trigger(plane);
    }
  }

  private pickPlane(world: World): SimplePlane | undefined {
    const casters = this.components.get(Raycasters);
    const caster = casters.get(world);
    const meshes = this.getAllPlaneMeshes();
    const intersects = caster.castRay(meshes);
    if (intersects) {
      const found = intersects.object as THREE.Mesh;
      return this.list.find((p) => p.meshes.includes(found));
    }
    return undefined;
  }

  private getAllPlaneMeshes() {
    const meshes: THREE.Mesh[] = [];
    for (const plane of this.list) {
      meshes.push(...plane.meshes);
    }
    return meshes;
  }

  private createPlaneFromIntersection(
    world: World,
    intersect: THREE.Intersection,
  ) {
    if (!world.renderer) {
      throw new Error("The given world must have a renderer!");
    }
    const constant = intersect.point.distanceTo(new THREE.Vector3(0, 0, 0));
    const normal = intersect.face?.normal;
    if (!constant || !normal) {
      return null;
    }
    const worldNormal = this.getWorldNormal(intersect, normal);
    const plane = this.newPlane(world, intersect.point, worldNormal.negate());
    plane.visible = this._visible;
    plane.size = this._size;
    world.renderer.setPlane(true, plane.three);
    this.updateMaterialsAndPlanes();
    return plane;
  }

  private getWorldNormal(intersect: THREE.Intersection, normal: THREE.Vector3) {
    const object = intersect.object;
    let transform = intersect.object.matrixWorld.clone();
    const isInstance = object instanceof THREE.InstancedMesh;
    if (isInstance && intersect.instanceId !== undefined) {
      const temp = new THREE.Matrix4();
      object.getMatrixAt(intersect.instanceId, temp);
      transform = temp.multiply(transform);
    }
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(transform);
    const worldNormal = normal.clone().applyMatrix3(normalMatrix).normalize();
    this.normalizePlaneDirectionY(worldNormal);
    return worldNormal;
  }

  private normalizePlaneDirectionY(normal: THREE.Vector3) {
    if (this.orthogonalY) {
      if (normal.y > this.toleranceOrthogonalY) {
        normal.x = 0;
        normal.y = 1;
        normal.z = 0;
      }
      if (normal.y < -this.toleranceOrthogonalY) {
        normal.x = 0;
        normal.y = -1;
        normal.z = 0;
      }
    }
  }

  private newPlane(world: World, point: THREE.Vector3, normal: THREE.Vector3) {
    const plane = new this.Type(
      this.components,
      world,
      point,
      normal,
      this._material,
    );
    plane.onDraggingStarted.add(this._onStartDragging);
    plane.onDraggingEnded.add(this._onEndDragging);
    this.list.push(plane);
    this.onAfterCreate.trigger(plane);
    return plane;
  }

  private updateMaterialsAndPlanes() {
    const worlds = this.components.get(Worlds);
    for (const [_id, world] of worlds.list) {
      if (!world.renderer) {
        continue;
      }
      world.renderer.updateClippingPlanes();
      const { clippingPlanes } = world.renderer;
      for (const model of world.meshes) {
        if (!model.material) {
          continue;
        }
        if (Array.isArray(model.material)) {
          for (const mat of model.material) {
            mat.clippingPlanes = clippingPlanes;
          }
        } else {
          model.material.clippingPlanes = clippingPlanes;
        }
      }
    }
  }

  private _onStartDragging = () => {
    this.onBeforeDrag.trigger();
  };

  private _onEndDragging = () => {
    this.onAfterDrag.trigger();
  };
}
