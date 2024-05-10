import * as WEBIFC from "web-ifc";
import { FragmentsGroup } from "@thatopen/fragments";
import { Disposable, Event, Component, Components } from "../../core";
import { FragmentManager } from "../../fragments/FragmentManager";
import { IfcPropertiesUtils } from "../Utils";
import { getRelationMap } from "./src/get-relation-map";

// TODO: Refactor to combine logic from process and processFromWebIfc

interface RelationMap {
  [modelID: string]: Map<number, Map<number, number[]>>;
}

/**
 * Indexer for IFC entities, facilitating the indexing and retrieval of IFC entity relationships.
 * It is designed to process models properties by indexing their IFC entities' relations based on predefined inverse attributes, and provides methods to query these relations.
 */
export class IfcRelationsIndexer extends Component implements Disposable {
  static readonly uuid = "23a889ab-83b3-44a4-8bee-ead83438370b" as const;

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<string>();

  enabled: boolean = true;

  /**
   * All the inverse attributes this component can processes.
   */
  readonly inverseAttributes = [
    "IsDecomposedBy",
    "Decomposes",
    "AssociatedTo",
    "HasAssociations",
    "ClassificationForObjects",
    "IsGroupedBy",
    "HasAssignments",
    "IsDefinedBy",
    "DefinesOcurrence",
    "IsTypedBy",
    "Types",
    "Defines",
    "ContainedInStructure",
    "ContainsElements",
  ];

  inverseAttributesToProcess = [
    "HasAssignments",
    "IsDecomposedBy",
    "IsDefinedBy",
    "IsTypedBy",
    "HasAssociations",
    "ContainedInStructure",
  ];

  relToAttributesMap = new Map<
    number,
    { forRelating?: string; forRelated?: string }
  >();

  /**
   * Holds the relationship mappings for each model processed by the indexer.
   * The structure is a map where each key is a model's UUID, and the value is another map.
   * This inner map's keys are entity expressIDs, and its values are maps where each key is an index
   * representing a specific relation type, and the value is an array of expressIDs of entities
   * that are related through that relation type. This structure allows for efficient querying
   * of entity relationships within a model.
   */
  readonly relationMaps: RelationMap = {};

  constructor(components: Components) {
    super(components);
    this.components.add(IfcRelationsIndexer.uuid, this);
    const fragmentManager = components.get(FragmentManager);
    fragmentManager.onFragmentsDisposed.add(this.onFragmentsDisposed);
    this.setRelMap();
  }

  private onFragmentsDisposed = (data: {
    groupID: string;
    fragmentIDs: string[];
  }) => {
    delete this.relationMaps[data.groupID];
  };

  private getAttributeRels(value: string) {
    const keys: number[] = [];
    for (const [rel, attribute] of this.relToAttributesMap.entries()) {
      const { forRelating, forRelated } = attribute;
      if (forRelating === value || forRelated === value) keys.push(rel);
    }
    return keys;
  }

  // TODO: Construct this based on the IFC EXPRESS long form schema?
  private setRelMap() {
    this.relToAttributesMap.set(WEBIFC.IFCRELAGGREGATES, {
      forRelating: "IsDecomposedBy",
      forRelated: "Decomposes",
    });

    this.relToAttributesMap.set(WEBIFC.IFCRELASSOCIATESMATERIAL, {
      forRelating: "AssociatedTo",
      forRelated: "HasAssociations",
    });

    this.relToAttributesMap.set(WEBIFC.IFCRELASSOCIATESCLASSIFICATION, {
      forRelating: "ClassificationForObjects",
      forRelated: "HasAssociations",
    });

    this.relToAttributesMap.set(WEBIFC.IFCRELASSIGNSTOGROUP, {
      forRelating: "IsGroupedBy",
      forRelated: "HasAssignments",
    });

    this.relToAttributesMap.set(WEBIFC.IFCRELDEFINESBYPROPERTIES, {
      forRelated: "IsDefinedBy",
      forRelating: "DefinesOcurrence",
    });

    this.relToAttributesMap.set(WEBIFC.IFCRELDEFINESBYTYPE, {
      forRelated: "IsTypedBy",
      forRelating: "Types",
    });

    this.relToAttributesMap.set(WEBIFC.IFCRELDEFINESBYTEMPLATE, {
      forRelated: "IsDefinedBy",
      forRelating: "Defines",
    });

    this.relToAttributesMap.set(WEBIFC.IFCRELCONTAINEDINSPATIALSTRUCTURE, {
      forRelated: "ContainedInStructure",
      forRelating: "ContainsElements",
    });
  }

  /**
   * Processes a given model to index its IFC entities relations based on predefined inverse attributes.
   * This method iterates through each specified inverse attribute, retrieves the corresponding relations,
   * and maps them in a structured way to facilitate quick access to related entities.
   *
   * The process involves querying the model for each relation type associated with the inverse attributes
   * and updating the internal relationMaps with the relationships found. This map is keyed by the model's UUID
   * and contains a nested map where each key is an entity's expressID and its value is another map.
   * This inner map's keys are the indices of the inverse attributes, and its values are arrays of expressIDs
   * of entities that are related through that attribute.
   *
   * @param model The `FragmentsGroup` model to be processed. It must have properties loaded.
   * @returns A promise that resolves to the relations map for the processed model. This map is a detailed
   * representation of the relations indexed by entity expressIDs and relation types.
   * @throws An error if the model does not have properties loaded.
   */
  async process(model: FragmentsGroup) {
    if (!model.hasProperties)
      throw new Error("FragmentsGroup properties not found");

    this.relationMaps[model.uuid] = new Map();

    const relationsMap = this.relationMaps[model.uuid];

    for (const attribute of this.inverseAttributesToProcess) {
      const rels = this.getAttributeRels(attribute);
      for (const rel of rels) {
        await IfcPropertiesUtils.getRelationMap(
          model,
          rel,
          async (relatingID, relatedID) => {
            const inverseAttributes = this.relToAttributesMap.get(rel);
            if (!inverseAttributes) return;
            const { forRelated: related, forRelating: relating } =
              inverseAttributes;
            if (
              relating &&
              this.inverseAttributesToProcess.includes(relating)
            ) {
              const currentMap =
                relationsMap.get(relatingID) ?? new Map<number, number[]>();
              // TODO: indexOf might be slow. Better a Map<string, number>?
              const index = this.inverseAttributes.indexOf(relating);
              currentMap.set(index, relatedID);
              relationsMap.set(relatingID, currentMap);
            }
            if (related && this.inverseAttributesToProcess.includes(related)) {
              for (const id of relatedID) {
                const currentMap =
                  relationsMap.get(id) ?? new Map<number, number[]>();
                const index = this.inverseAttributes.indexOf(related);
                const relations = currentMap.get(index) ?? [];
                relations.push(relatingID);
                currentMap.set(index, relations);
                relationsMap.set(id, currentMap);
              }
            }
          },
        );
      }
    }

    return relationsMap;
  }

  /**
   * Processes a given model from a WebIfc API to index its IFC entities relations based on predefined inverse attributes.
   *
   * @param ifcApi - The WebIfc API instance from which to retrieve the model's properties.
   * @param modelID - The unique identifier of the model within the WebIfc API.
   * @returns A promise that resolves to the relations map for the processed model.
   *          This map is a detailed representation of the relations indexed by entity expressIDs and relation types.
   */
  async processFromWebIfc(ifcApi: WEBIFC.IfcAPI, modelID: number) {
    const relationsMap = new Map<number, Map<number, number[]>>();

    const properties: Record<string, Record<string, any>> = {};
    const lines = ifcApi.GetAllLines(modelID);

    for (let i = 0; i < lines.size(); i++) {
      const line = lines.get(i);
      const attrs = await ifcApi.properties.getItemProperties(modelID, line);
      properties[line] = attrs;
    }

    for (const attribute of this.inverseAttributesToProcess) {
      const rels = this.getAttributeRels(attribute);
      for (const rel of rels) {
        getRelationMap(properties, rel, (relatingID, relatedID) => {
          const inverseAttributes = this.relToAttributesMap.get(rel);
          if (!inverseAttributes) return;
          const { forRelated: related, forRelating: relating } =
            inverseAttributes;
          if (relating && this.inverseAttributesToProcess.includes(relating)) {
            const currentMap =
              relationsMap.get(relatingID) ?? new Map<number, number[]>();
            const index = this.inverseAttributes.indexOf(relating);
            currentMap.set(index, relatedID);
            relationsMap.set(relatingID, currentMap);
          }
          if (related && this.inverseAttributesToProcess.includes(related)) {
            for (const id of relatedID) {
              const currentMap =
                relationsMap.get(id) ?? new Map<number, number[]>();
              const index = this.inverseAttributes.indexOf(related);
              const relations = currentMap.get(index) ?? [];
              relations.push(relatingID);
              currentMap.set(index, relations);
              relationsMap.set(id, currentMap);
            }
          }
        });
      }
    }

    return relationsMap;
  }

  /**
   * Retrieves the relations of a specific entity within a model based on the given relation name.
   * This method searches the indexed relation maps for the specified model and entity,
   * returning the IDs of related entities if a match is found.
   *
   * @param model The `FragmentsGroup` model containing the entity.
   * @param expressID The unique identifier of the entity within the model.
   * @param relationName The IFC schema inverse attribute of the relation to search for (e.g., "IsDefinedBy", "ContainsElements").
   * @returns An array of express IDs representing the related entities, or `null` if no relations are found
   * or the specified relation name is not indexed.
   */
  getEntityRelations(
    model: FragmentsGroup,
    expressID: number,
    relationName: string,
  ) {
    const indexMap = this.relationMaps[model.uuid];
    if (!indexMap) return null;
    const entityRelations = indexMap.get(expressID);
    const attributeIndex = this.inverseAttributes.indexOf(relationName);
    if (!entityRelations || attributeIndex === -1) return null;
    const relations = entityRelations.get(attributeIndex);
    if (!relations) return null;
    return relations;
  }

  /**
   * Serializes the relations of a given relation map into a JSON string.
   * This method iterates through the relations in the given map, organizing them into a structured object where each key is an expressID of an entity,
   * and its value is another object mapping relation indices to arrays of related entity expressIDs.
   * The resulting object is then serialized into a JSON string.
   *
   * @param relationMap - The map of relations to be serialized. The map keys are expressIDs of entities, and the values are maps where each key is a relation type ID and its value is an array of expressIDs of entities related through that relation type.
   * @returns A JSON string representing the serialized relations of the given relation map.
   */
  serializeRelations(relationMap: Map<number, Map<number, number[]>>) {
    const object: Record<string, Record<string, number[]>> = {};
    for (const [expressID, relations] of relationMap.entries()) {
      if (!object[expressID]) object[expressID] = {};
      for (const [relationID, relationEntities] of relations.entries()) {
        object[expressID][relationID] = relationEntities;
      }
    }
    return JSON.stringify(object);
  }

  /**
   * Serializes the relations of a specific model into a JSON string.
   * This method iterates through the relations indexed for the given model,
   * organizing them into a structured object where each key is an expressID of an entity,
   * and its value is another object mapping relation indices to arrays of related entity expressIDs.
   * The resulting object is then serialized into a JSON string.
   *
   * @param model The `FragmentsGroup` model whose relations are to be serialized.
   * @returns A JSON string representing the serialized relations of the specified model.
   * If the model has no indexed relations, `null` is returned.
   */
  serializeModelRelations(model: FragmentsGroup) {
    const relationsMap = this.relationMaps[model.uuid];
    if (!relationsMap) return null;
    const json = this.serializeRelations(relationsMap);
    return json;
  }

  /**
   * Serializes all relations of every model processed by the indexer into a JSON string.
   * This method iterates through each model's relations indexed in `relationMaps`, organizing them
   * into a structured JSON object. Each top-level key in this object corresponds to a model's UUID,
   * and its value is another object mapping entity expressIDs to their related entities, categorized
   * by relation types. The structure facilitates easy access to any entity's relations across all models.
   *
   * @returns A JSON string representing the serialized relations of all models processed by the indexer.
   *          If no relations have been indexed, an empty object is returned as a JSON string.
   */
  serializeAllRelations() {
    const jsonObject: Record<
      string,
      Record<string, Record<string, number[]>>
    > = {};
    for (const uuid in this.relationMaps) {
      const indexMap = this.relationMaps[uuid];
      const object: Record<string, Record<string, number[]>> = {};
      for (const [expressID, relations] of indexMap.entries()) {
        if (!object[expressID]) object[expressID] = {};
        for (const [relationID, relationEntities] of relations.entries()) {
          object[expressID][relationID] = relationEntities;
        }
      }
      jsonObject[uuid] = object;
    }
    return JSON.stringify(jsonObject);
  }

  /**
   * Converts a JSON string representing relations between entities into a structured map.
   * This method parses the JSON string to reconstruct the relations map that indexes
   * entity relations by their express IDs. The outer map keys are the express IDs of entities,
   * and the values are maps where each key is a relation type ID and its value is an array
   * of express IDs of entities related through that relation type.
   *
   * @param json The JSON string to be parsed into the relations map.
   * @returns A `Map` where the key is the express ID of an entity as a number, and the value
   * is another `Map`. This inner map's key is the relation type ID as a number, and its value
   * is an array of express IDs (as numbers) of entities related through that relation type.
   */
  getRelationsMapFromJSON(json: string) {
    const relations = JSON.parse(json);
    const indexMap = new Map<number, Map<number, number[]>>();
    for (const expressID in relations) {
      const expressIDRelations = relations[expressID];
      const relationMap = new Map<number, number[]>();
      for (const relationID in expressIDRelations) {
        relationMap.set(Number(relationID), expressIDRelations[relationID]);
      }
      indexMap.set(Number(expressID), relationMap);
    }
    return indexMap;
  }

  /**
   * Disposes the component, cleaning up resources and detaching event listeners.
   * This ensures that the component is properly cleaned up and does not leave behind any
   * references that could prevent garbage collection.
   */
  dispose() {
    (this.relationMaps as any) = {};
    const fragmentManager = this.components.get(FragmentManager);
    fragmentManager.onFragmentsDisposed.remove(this.onFragmentsDisposed);
    this.onDisposed.trigger(IfcRelationsIndexer.uuid);
    this.onDisposed.reset();
  }
}
