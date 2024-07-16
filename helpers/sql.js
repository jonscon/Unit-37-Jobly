const { BadRequestError } = require("../expressError");

/** Updates user or company with `dataToUpdate`.
 * 
 * In order to update values, dataToUpdate needs to be converted from
 * a JavaScript object to SQL syntax. This function does that, keeping 
 * the User and Company models clean.
 * 
 * dataToUpdate can be:
 *    { firstName, lastName, password, email, isAdmin } OR
 *    { name, description, numEmployees, logoUrl}
 * 
 * JS syntax utilizes camelCase. SQL syntax utilizes snake_case.
 * jsToSQL ensures that the keys in dataToUpdate are in correct case.
 * For example:
 *    jsToSql = { 
 *        firstName : "first_name",
 *        lastName : "last_name",
 *        isAdmin : "is_admin"
 *    }
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  // isolate the dataToUpdate keys
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // convert the keys from camelCase to snake_case. 
  // if key is one word, no conversion is necessary.
  // e.g. dataToUpdate = { firstName: 'Aliya', age: 32 } 
  // [ firstName, age ] => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`
  );

  // setCols: array of cols converted to string to use in SQL
  //    e.g. '"first_name=$1, last_name=$2"
  
  // values: array of values to insert into placeholders
  //    e.g. ['Aliya', 32]
  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
