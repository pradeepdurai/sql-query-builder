/**
 *
 * Builer class to generate the sql query
 *
 */
class Builder {
  constructor() {
    this._query = {};
  }
  //****************************************************************************/
  #query = {
    select: [],
    from: [],
    join: [],
    where: [],
    whereIn : [],
    query: [],
    groupBy : [],
  };
  #lastQuery = "";
  //****************************************************************************/



  /**
   * 
   * *************************************************************************
   * Select fields
   * *************************************************************************
   * 
   * @param {string} field
   * @returns string
   */
  select(field = "*") {
    this.#query.select = `SELECT ${field} `;
    return this;
  }

  /**
   * 
   * ************************************************************************
   * Select the table name
   * ************************************************************************
   * 
   * @param {string} table
   * @returns
   */
  from(table = "") {
    this.#query.from = `FROM ${table} `;
    return this;
  }

  /**
   * 
   * ************************************************************************
   * Join Condition
   * ************************************************************************
   * 
   * @param {string} Table_Name
   * @param {string} Id_Reference
   * @param {string} Jion_Type
   * @returns
   */
  join(table, ref, join = "") {
    this.#query.join.push(`${join.toUpperCase()} JOIN ${table} ON ${ref}`);
    return this;
  }

  /**
   * 
   * ************************************************************************
   * Where Condition
   * ************************************************************************
   * 
   * @param {string} field 
   * @param {string} condition 
   * @param {string | number} value 
   * @returns 
   */
  where(field, condition, value){
    this.#query.where.push(` ${field} ${condition} ${value}`);
    return this
  }
  /**
   * 
   * ************************************************************************
   * Where in Condition
   * ************************************************************************
   * 
   * @param {*} field 
   * @param {array} Values 
   */
  whereIn(field, values){
    this.#query.whereIn.push(`${field} IN (${values.join()})`)
    return this
  }

  /**
   * 
   * ************************************************************************
   * Group By Condition
   * ************************************************************************
   * 
   * @param {Srting} field
   * @returns 
   */
  groupBy(field){
    this.#query.groupBy.push(`${field}`)
    return this
  }
  /**
   * 
   * ************************************************************************
   * Private Function
   * ************************************************************************
   * 
   * @param {string} Table_Name
   */
  #getDefault(defaultTable) {
    this.select("*");
    this.from(defaultTable);
  }
  /**
   * 
   * ************************************************************************
   * Private Function to Generate Query
   * ************************************************************************
   * 
   * @param {String} queryObj
   */

  #generateQuery(queryObj) {

    //Select
    if( queryObj.select != '')
        this.#query.query += queryObj.select;

    //From
    if( queryObj.from != '')
        this.#query.query += queryObj.from;

    //Joins
    if( queryObj.join.length)
        this.#query.query += queryObj.join.join("");

    //Where
    if( queryObj.where.length)
        this.#query.query += queryObj.where.length > 1 ?  " WHERE"+queryObj.where.join(" AND ") :  " WHERE"+queryObj.where;

    // Where in 
    if(queryObj.whereIn.length)
        this.#query.query += (queryObj.whereIn) && (queryObj.where.length) ?  " AND "+queryObj.whereIn.join(" AND ")  :   " WHERE "+queryObj.whereIn.join(" AND ")

    // GroupBy
    if(queryObj.groupBy.length)
        this.#query.query += " GROUP BY "+queryObj.groupBy.join();
    //Get Last Query
    this.#lastQuery = this.#query.query;
  }

  /**
   * 
   */
  #appendDild(field){
    let finalQr = new Array();
    field = field.split(".");
    field.map((val, index) => {
      finalQr.push(`\`${val}\``)
    })
    return finalQr.join(".")
  }

  /**
   * 
   * ************************************************************************
   * Get Last Executed Query
   * ************************************************************************
   * 
   * @returns {string} Last Executed ASQuery
   */
  getLastQuery() {
    return this.#lastQuery;
  }

  /**
   * 
   * ************************************************************************
   * Get the Final Query
   * ************************************************************************
   * 
   * @param {String} Table_Name
   * @returns {String} Final Query
   */
  get(defaultTable = null) {
    defaultTable
      ? this.#getDefault(defaultTable)
      : this.#generateQuery(this.#query);
    return this.#query.query;
  }
}

module.exports = Builder;
