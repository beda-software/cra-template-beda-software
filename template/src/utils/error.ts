import * as _ from 'lodash';
import {OperationOutcome} from "src/contrib/aidbox";


export function isOperationOutcome(error: any): error is OperationOutcome {
    return _.isPlainObject(error) && error.resourceType === 'OperationOutcome';
}

export function isConflict(error: OperationOutcome) {
    return _.some(error.issue, (issue) => issue.code === 'conflict');
}

export function formatError(error: any) {
    if (!isOperationOutcome(error)) {
        return `Something went wrong.\n${JSON.stringify(error)}`;
    }
    if (isConflict(error)) {
        return 'You have outdated data on the page. Please refresh the page and try again';
    }

    const errorCodes = _.uniq(_.map(error.issue, (issue) => issue.code));

    return `Something went wrong.\nError codes: ${_.join(errorCodes, ', ')}`;
}
