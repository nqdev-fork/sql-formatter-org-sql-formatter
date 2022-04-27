import dedent from 'dedent-js';
import * as sqlFormatter from '../src/sqlFormatter';
import MySqlFormatter from '../src/languages/mysql.formatter';
import behavesLikeMariaDbFormatter from './behavesLikeMariaDbFormatter';

import supportsStrings from './features/strings';
import supportsOperators from './features/operators';

describe('MySqlFormatter', () => {
  const language = 'mysql';
  const format = (query, cfg = {}) => sqlFormatter.format(query, { ...cfg, language });

  behavesLikeMariaDbFormatter(language, format);

  supportsStrings(language, format, MySqlFormatter.stringTypes);
  supportsOperators(
    language,
    format,
    MySqlFormatter.operators,
    MySqlFormatter.reservedLogicalOperators
  );

  it('supports @@ system variables', () => {
    const result = format('SELECT @@GLOBAL.time, @@SYSTEM.date, @@hour FROM foo;');
    expect(result).toBe(dedent`
      SELECT
        @@GLOBAL.time,
        @@SYSTEM.date,
        @@hour
      FROM
        foo;
    `);
  });
});
