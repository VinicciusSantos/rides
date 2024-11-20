import { literal, Op, Order } from 'sequelize';

import { SearchParamsConstructorProps } from '../../../domain/repository';
import { SequelizeDb } from './sequelize';

/**
 * OpBuilder is a helper class to build where and order conditions
 */
export class OpBuilder {
  /**
   * MultipleExact is a helper function to build an where condition to search for exact values in a array of values
   * @param key is the column name
   * @param values is the array of values to search
   * @returns the object with the or condition
   */
  public static MultipleExact(key: string, values?: string[]) {
    if (!values || !values.length) {
      return {};
    }

    return { [Op.or]: values.map((value) => ({ [key]: value })) };
  }

  /**
   * MultipleLike is a helper function to build an where condition to search for segments of a array of values
   * @param key is the column name
   * @param values is the array of values to search
   * @returns the object with the or like condition
   */
  public static MultipleLike(key: string, values?: string[]) {
    if (!values || !values.length) {
      return {};
    }

    return {
      [Op.or]: values.map((value) => ({
        [key]: { [Op.like]: `%${value}%` },
      })),
    };
  }

  /**
   * Order is a helper function to build an order condition
   * @param params is the object with the sort and sort_dir
   * @returns the order condition
   */
  public static Order(params: SearchParamsConstructorProps<unknown>): Order {
    if (SequelizeDb.sequelize.getDialect() === 'mysql') {
      return literal(`binary ${params.sort} ${params.sort_dir}`);
    }
    return literal(`${params.sort} ${params.sort_dir}`);
  }
}
