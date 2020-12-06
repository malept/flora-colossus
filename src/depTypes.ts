export enum DepType {
  PROD,
  DEV,
  ROOT,
}

export enum DepRequireState {
  OPTIONAL,
  REQUIRED,
}

export class DepRelationship {
  constructor(private type: DepType, private required: DepRequireState) {}

  public getType(): DepType {
    return this.type;
  }
  public getRequired(): DepRequireState {
    return this.required;
  }
  public toString(): string {
    return `${DepType[this.getType()]}_${DepRequireState[this.getRequired()]}`;
  }
}

export const depRequireStateGreater = (
  newState: DepRequireState,
  existing: DepRequireState
): boolean => {
  if (existing === DepRequireState.REQUIRED) {
    return false;
  } else if (newState === DepRequireState.REQUIRED) {
    return true;
  }
  return false;
};

export const depTypeGreater = (
  newType: DepType,
  existing: DepType
): boolean => {
  switch (existing) {
    case DepType.DEV:
      switch (newType) {
        case DepType.PROD:
        case DepType.ROOT:
          return true;
        case DepType.DEV:
        default:
          return false;
      }
    case DepType.PROD:
      switch (newType) {
        case DepType.ROOT:
          return true;
        case DepType.PROD:
        case DepType.DEV:
        default:
          return false;
      }
    case DepType.ROOT:
      switch (newType) {
        case DepType.ROOT:
        case DepType.PROD:
        case DepType.DEV:
        default:
          return false;
      }
    default:
      return false;
  }
};

export const depRelationshipGreater = (
  newRelationship: DepRelationship,
  existingRelationship: DepRelationship
): boolean => {
  const newType = newRelationship.getType();
  const existingType = existingRelationship.getType();
  return (
    depTypeGreater(newType, existingType) ||
    (newType === existingType &&
      depRequireStateGreater(
        newRelationship.getRequired(),
        existingRelationship.getRequired()
      ))
  );
};

export const childRequired = (
  parent: DepRequireState,
  child: DepRequireState
): DepRequireState => {
  switch (parent) {
    case DepRequireState.OPTIONAL:
      return DepRequireState.OPTIONAL;
    default:
      return child;
  }
};
