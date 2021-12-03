import _ from 'lodash';
import { QueryResultRowType, sql, TaggedTemplateLiteralInvocationType } from 'slonik';

export const dateTimeAsTimestamp = (
  dateObj: Date | null
): TaggedTemplateLiteralInvocationType<QueryResultRowType> => {
  if (dateObj) {
    return sql`TO_TIMESTAMP(${dateObj.getSeconds()})`;
  } else {
    return sql`null`;
  }
};
