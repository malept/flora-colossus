import { expect } from 'chai';

import {
  DepRelationship,
  DepRequireState,
  DepType,
  childRequired,
  depTypeGreater,
  depRelationshipGreater,
  depRequireStateGreater,
} from '../src/depTypes';

describe('depTypes', () => {
  describe('DepType enum', () => {
    it('should contain unique numbers', () => {
      expect(
        Object.keys(DepType)
          .map((key) => DepType[key])
          .filter((value) => typeof value === 'number').length
      ).to.equal(3);
    });
  });

  describe('DepRequireState enum', () => {
    it('should contain unique numbers', () => {
      expect(
        Object.keys(DepRequireState)
          .map((key) => DepRequireState[key])
          .filter((value) => typeof value === 'number').length
      ).to.equal(2);
    });
  });

  describe('childRequired', () => {
    it('should mark children of optional deps as optional', () => {
      expect(
        childRequired(DepRequireState.OPTIONAL, DepRequireState.REQUIRED)
      ).to.equal(DepRequireState.OPTIONAL);
    });

    it('should mark required children of required deps as required', () => {
      expect(
        childRequired(DepRequireState.REQUIRED, DepRequireState.REQUIRED)
      ).to.equal(DepRequireState.REQUIRED);
    });

    it('should mark optional children of required deps as optional', () => {
      expect(
        childRequired(DepRequireState.REQUIRED, DepRequireState.OPTIONAL)
      ).to.equal(DepRequireState.OPTIONAL);
    });
  });

  describe('depTypeGreater', () => {
    it('should report PROD > DEV', () => {
      expect(depTypeGreater(DepType.PROD, DepType.DEV)).to.equal(true);
    });

    it('should report ROOT > DEV', () => {
      expect(depTypeGreater(DepType.ROOT, DepType.DEV)).to.equal(true);
    });

    it('should report DEV < PROD', () => {
      expect(depTypeGreater(DepType.DEV, DepType.PROD)).to.equal(false);
    });

    it('should report ROOT > PROD', () => {
      expect(depTypeGreater(DepType.ROOT, DepType.PROD)).to.equal(true);
    });

    it('should report DEV < ROOT', () => {
      expect(depTypeGreater(DepType.DEV, DepType.ROOT)).to.equal(false);
    });

    it('should report PROD < ROOT', () => {
      expect(depTypeGreater(DepType.PROD, DepType.ROOT)).to.equal(false);
    });
  });

  describe('depRequireStateGreater', () => {
    it('should report REQUIRED > OPTIONAL', () => {
      expect(
        depRequireStateGreater(
          DepRequireState.REQUIRED,
          DepRequireState.OPTIONAL
        )
      ).to.equal(true);
    });

    it('should report OPTIONAL < REQUIRED', () => {
      expect(
        depRequireStateGreater(
          DepRequireState.OPTIONAL,
          DepRequireState.REQUIRED
        )
      ).to.equal(false);
    });

    /**
     * These tests ensure that the method will not modify things that are identical
     */
    it('should report OPTIONAL is not greater than OPTIONAL', () => {
      expect(
        depRequireStateGreater(
          DepRequireState.OPTIONAL,
          DepRequireState.OPTIONAL
        )
      ).to.equal(false);
    });

    it('should report REQUIRED is not greater than REQUIRED', () => {
      expect(
        depRequireStateGreater(
          DepRequireState.REQUIRED,
          DepRequireState.REQUIRED
        )
      ).to.equal(false);
    });
  });

  describe('depRelationshipGreater', () => {
    const rel = (depType: DepType, state: DepRequireState) =>
      new DepRelationship(depType, state);

    function expectGreaterRelationship(
      newRel: DepRelationship,
      existingRel: DepRelationship
    ) {
      expect(depRelationshipGreater(newRel, existingRel)).to.equal(true);
    }

    function expectNotGreaterRelationship(
      newRel: DepRelationship,
      existingRel: DepRelationship
    ) {
      expect(depRelationshipGreater(newRel, existingRel)).to.equal(false);
    }

    it('should report ROOT_REQUIRED is not greater than ROOT_REQUIRED', () => {
      const sameRel = rel(DepType.ROOT, DepRequireState.REQUIRED);
      expectNotGreaterRelationship(sameRel, sameRel);
    });

    it('should report ROOT_REQUIRED > ROOT_OPTIONAL', () => {
      expectGreaterRelationship(
        rel(DepType.ROOT, DepRequireState.REQUIRED),
        rel(DepType.ROOT, DepRequireState.OPTIONAL)
      );
    });

    it('should report ROOT_REQUIRED > PROD_REQUIRED', () => {
      expectGreaterRelationship(
        rel(DepType.ROOT, DepRequireState.REQUIRED),
        rel(DepType.PROD, DepRequireState.REQUIRED)
      );
    });

    it('should report ROOT_REQUIRED > PROD_OPTIONAL', () => {
      expectGreaterRelationship(
        rel(DepType.ROOT, DepRequireState.REQUIRED),
        rel(DepType.PROD, DepRequireState.OPTIONAL)
      );
    });

    it('should report ROOT_REQUIRED > DEV_REQUIRED', () => {
      expectGreaterRelationship(
        rel(DepType.ROOT, DepRequireState.REQUIRED),
        rel(DepType.DEV, DepRequireState.REQUIRED)
      );
    });

    it('should report ROOT_REQUIRED > DEV_OPTIONAL', () => {
      expectGreaterRelationship(
        rel(DepType.ROOT, DepRequireState.REQUIRED),
        rel(DepType.DEV, DepRequireState.OPTIONAL)
      );
    });

    it('should report ROOT_OPTIONAL is not greater than ROOT_REQUIRED', () => {
      expectNotGreaterRelationship(
        rel(DepType.ROOT, DepRequireState.OPTIONAL),
        rel(DepType.ROOT, DepRequireState.REQUIRED)
      );
    });

    it('should report ROOT_OPTIONAL is not greater than ROOT_OPTIONAL', () => {
      const sameRel = rel(DepType.ROOT, DepRequireState.REQUIRED);
      expectNotGreaterRelationship(sameRel, sameRel);
    });

    it('should report ROOT_OPTIONAL > PROD_REQUIRED', () => {
      expectGreaterRelationship(
        rel(DepType.ROOT, DepRequireState.OPTIONAL),
        rel(DepType.PROD, DepRequireState.REQUIRED)
      );
    });

    it('should report ROOT_OPTIONAL > PROD_OPTIONAL', () => {
      expectGreaterRelationship(
        rel(DepType.ROOT, DepRequireState.OPTIONAL),
        rel(DepType.PROD, DepRequireState.OPTIONAL)
      );
    });

    it('should report ROOT_OPTIONAL > DEV_REQUIRED', () => {
      expectGreaterRelationship(
        rel(DepType.ROOT, DepRequireState.OPTIONAL),
        rel(DepType.DEV, DepRequireState.REQUIRED)
      );
    });

    it('should report ROOT_OPTIONAL > DEV_OPTIONAL', () => {
      expectGreaterRelationship(
        rel(DepType.ROOT, DepRequireState.OPTIONAL),
        rel(DepType.DEV, DepRequireState.OPTIONAL)
      );
    });

    it('should report PROD_REQUIRED is not greater than ROOT_REQUIRED', () => {
      expectNotGreaterRelationship(
        rel(DepType.PROD, DepRequireState.REQUIRED),
        rel(DepType.ROOT, DepRequireState.REQUIRED)
      );
    });

    it('should report PROD_REQUIRED is not greater than ROOT_OPTIONAL', () => {
      expectNotGreaterRelationship(
        rel(DepType.PROD, DepRequireState.REQUIRED),
        rel(DepType.ROOT, DepRequireState.OPTIONAL)
      );
    });

    it('should report PROD_REQUIRED is not greater than PROD_REQUIRED', () => {
      const sameRel = rel(DepType.PROD, DepRequireState.REQUIRED);
      expectNotGreaterRelationship(sameRel, sameRel);
    });

    it('should report PROD_REQUIRED > PROD_OPTIONAL', () => {
      expectGreaterRelationship(
        rel(DepType.PROD, DepRequireState.REQUIRED),
        rel(DepType.PROD, DepRequireState.OPTIONAL)
      );
    });

    it('should report PROD_REQUIRED > DEV_REQUIRED', () => {
      expectGreaterRelationship(
        rel(DepType.PROD, DepRequireState.REQUIRED),
        rel(DepType.DEV, DepRequireState.REQUIRED)
      );
    });

    it('should report PROD_REQUIRED > DEV_OPTIONAL', () => {
      expectGreaterRelationship(
        rel(DepType.PROD, DepRequireState.REQUIRED),
        rel(DepType.DEV, DepRequireState.OPTIONAL)
      );
    });

    it('should report PROD_OPTIONAL is not greater than ROOT_REQUIRED', () => {
      expectNotGreaterRelationship(
        rel(DepType.PROD, DepRequireState.OPTIONAL),
        rel(DepType.ROOT, DepRequireState.REQUIRED)
      );
    });

    it('should report PROD_OPTIONAL is not greater than ROOT_OPTIONAL', () => {
      expectNotGreaterRelationship(
        rel(DepType.PROD, DepRequireState.OPTIONAL),
        rel(DepType.ROOT, DepRequireState.OPTIONAL)
      );
    });

    it('should report PROD_OPTIONAL is not greater than PROD_REQUIRED', () => {
      expectNotGreaterRelationship(
        rel(DepType.PROD, DepRequireState.OPTIONAL),
        rel(DepType.PROD, DepRequireState.REQUIRED)
      );
    });

    it('should report PROD_OPTIONAL is not greater than PROD_OPTIONAL', () => {
      const sameRel = rel(DepType.PROD, DepRequireState.OPTIONAL);
      expectNotGreaterRelationship(sameRel, sameRel);
    });

    it('should report PROD_OPTIONAL > DEV_REQUIRED', () => {
      expectGreaterRelationship(
        rel(DepType.PROD, DepRequireState.OPTIONAL),
        rel(DepType.DEV, DepRequireState.REQUIRED)
      );
    });

    it('should report PROD_OPTIONAL > DEV_OPTIONAL', () => {
      expectGreaterRelationship(
        rel(DepType.PROD, DepRequireState.OPTIONAL),
        rel(DepType.DEV, DepRequireState.OPTIONAL)
      );
    });

    it('should report DEV_REQUIRED is not greater than ROOT_REQUIRED', () => {
      expectNotGreaterRelationship(
        rel(DepType.DEV, DepRequireState.REQUIRED),
        rel(DepType.ROOT, DepRequireState.REQUIRED)
      );
    });

    it('should report DEV_REQUIRED is not greater than ROOT_OPTIONAL', () => {
      expectNotGreaterRelationship(
        rel(DepType.DEV, DepRequireState.REQUIRED),
        rel(DepType.ROOT, DepRequireState.OPTIONAL)
      );
    });

    it('should report DEV_REQUIRED is not greater than PROD_REQUIRED', () => {
      expectNotGreaterRelationship(
        rel(DepType.DEV, DepRequireState.REQUIRED),
        rel(DepType.PROD, DepRequireState.REQUIRED)
      );
    });

    it('should report DEV_REQUIRED is not greater than PROD_OPTIONAL', () => {
      expectNotGreaterRelationship(
        rel(DepType.DEV, DepRequireState.REQUIRED),
        rel(DepType.PROD, DepRequireState.OPTIONAL)
      );
    });

    it('should report DEV_REQUIRED is not greater than DEV_REQUIRED', () => {
      const sameRel = rel(DepType.DEV, DepRequireState.REQUIRED);
      expectNotGreaterRelationship(sameRel, sameRel);
    });

    it('should report DEV_REQUIRED > DEV_OPTIONAL', () => {
      expectGreaterRelationship(
        rel(DepType.PROD, DepRequireState.OPTIONAL),
        rel(DepType.DEV, DepRequireState.OPTIONAL)
      );
    });

    it('should report DEV_OPTIONAL is not greater than ROOT_REQUIRED', () => {
      expectNotGreaterRelationship(
        rel(DepType.DEV, DepRequireState.OPTIONAL),
        rel(DepType.ROOT, DepRequireState.REQUIRED)
      );
    });

    it('should report DEV_OPTIONAL is not greater than ROOT_OPTIONAL', () => {
      expectNotGreaterRelationship(
        rel(DepType.DEV, DepRequireState.OPTIONAL),
        rel(DepType.ROOT, DepRequireState.OPTIONAL)
      );
    });

    it('should report DEV_OPTIONAL is not greater than PROD_REQUIRED', () => {
      expectNotGreaterRelationship(
        rel(DepType.DEV, DepRequireState.OPTIONAL),
        rel(DepType.PROD, DepRequireState.REQUIRED)
      );
    });

    it('should report DEV_OPTIONAL is not greater than PROD_OPTIONAL', () => {
      expectNotGreaterRelationship(
        rel(DepType.DEV, DepRequireState.OPTIONAL),
        rel(DepType.PROD, DepRequireState.OPTIONAL)
      );
    });

    it('should report DEV_OPTIONAL is not greater than DEV_OPTIONAL', () => {
      expectNotGreaterRelationship(
        rel(DepType.DEV, DepRequireState.OPTIONAL),
        rel(DepType.DEV, DepRequireState.REQUIRED)
      );
    });

    it('should report DEV_OPTIONAL is not greater than DEV_OPTIONAL', () => {
      const sameRel = rel(DepType.DEV, DepRequireState.OPTIONAL);
      expectNotGreaterRelationship(sameRel, sameRel);
    });
  });
});
