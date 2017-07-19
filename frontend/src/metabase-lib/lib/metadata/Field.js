/* @flow weak */

import Base from "./Base";
import Table from "./Table";

import { FieldIDDimension } from "../Dimension";

import { getFieldValues } from "metabase/lib/query/field";
import {
    isDate,
    isNumber,
    isNumeric,
    isBoolean,
    isString,
    isSummable,
    isCategory,
    isDimension,
    isMetric,
    isPK,
    isFK,
    isEntityName,
    getIconForField,
    getFieldType
} from "metabase/lib/schema_metadata";

import _ from "underscore";

/**
 * Wrapper class for field metadata objects. Belongs to a Table.
 */
export default class Field extends Base {
    displayName: string;
    description: string;

    table: Table;

    fieldType() {
        return getFieldType(this);
    }

    isDate() {
        return isDate(this);
    }
    isNumber() {
        return isNumber(this);
    }
    isNumeric() {
        return isNumeric(this);
    }
    isBoolean() {
        return isBoolean(this);
    }
    isString() {
        return isString(this);
    }
    isSummable() {
        return isSummable(this);
    }
    isCategory() {
        return isCategory(this);
    }
    isMetric() {
        return isMetric(this);
    }

    isCompatibleWith(field: Field) {
        return this.isDate() === field.isDate() ||
            this.isNumeric() === field.isNumeric() ||
            this.id === field.id;
    }

    /**
     * Tells if this column can be used in a breakout
     * Currently returns `true` for everything expect for aggregation columns
     */
    isDimension() {
        return isDimension(this);
    }
    isID() {
        return isPK(this) || isFK(this);
    }
    isPK() {
        return isPK(this);
    }
    isFK() {
        return isFK(this);
    }
    isEntityName() {
        return isEntityName(this);
    }

    fieldValues(): Array<string> {
        return getFieldValues(this._object);
    }

    icon() {
        return getIconForField(this);
    }

    dimension() {
        return new FieldIDDimension(null, [this.id], this.metadata);
    }

    operator(op) {
        if (this.operators_lookup) {
            return this.operators_lookup[op];
        }
    }

    remappedField() {
        // TODO: use actual remappings once branch is merged
        let table;
        if (this.isFK()) {
            table = this.target && this.target.table;
        } else if (this.isPK()) {
            table = this.table;
        }
        return table && _.find(table.fields, field => field.isEntityName());
    }

    remappedValue(value) {
        // Ugh. Should this be handled further up?
        if (this.isNumeric() && typeof value !== "number") {
            value = parseFloat(value);
        }
        // TODO: more efficient lookup (memoized Map?)
        let remapping = _.findWhere(this.remappings, { [0]: value });
        return remapping && remapping[1];
    }

    /**
     * Returns a default breakout MBQL clause for this field
     *
     * Tries to look up a default subdimension (like "Created At: Day" for "Created At" field)
     * and if it isn't found, uses the plain field id dimension (like "Product ID") as a fallback.
     */
    getDefaultBreakout = () => {
        const fieldIdDimension = this.dimension();
        const defaultSubDimension = fieldIdDimension.defaultDimension();
        if (defaultSubDimension) {
            return defaultSubDimension.mbql();
        } else {
            return fieldIdDimension.mbql();
        }
    };
}
