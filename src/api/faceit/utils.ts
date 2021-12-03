import _ from 'lodash';
import { QueryResultRowType, sql, TaggedTemplateLiteralInvocationType } from 'slonik';

export const dateTimeAsTimestamp = (
  dateObj: Date | null
): TaggedTemplateLiteralInvocationType<QueryResultRowType> => {
  if (dateObj) {
    const x = sql`TO_TIMESTAMP(${dateObj.getMilliseconds()})`;
    console.log('sql to timestamp: ', x);
    return sql`TO_TIMESTAMP(${dateObj.getMilliseconds()})`;
  } else {
    return sql`null`;
  }
};
