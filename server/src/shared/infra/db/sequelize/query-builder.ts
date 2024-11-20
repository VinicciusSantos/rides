import { Transaction } from 'sequelize';
import { ModelCtor } from 'sequelize-typescript';

export interface UpdateN2NRelationsProps {
  root_id: string;
  root_key: string;
  transaction: Transaction | null;
  relations: N2NRelationProps[];
}

export interface N2NRelationProps {
  key: string;
  model: ModelCtor;
  previous_value: string[];
  current_value?: string[];
}

export class QueryBuilder {
  public static async updateN2NRelations(
    props: UpdateN2NRelationsProps,
  ): Promise<unknown> {
    const { root_id, root_key, transaction, relations } = props;

    const queries = relations.reduce((operations, relation) => {
      const {
        key,
        model,
        previous_value: previous,
        current_value: current = [],
      } = relation;

      const removedIDs = previous.filter((value) => !current.includes(value));
      if (removedIDs.length) {
        operations.push(
          ...removedIDs.map((id) =>
            model.destroy({
              where: { [key]: id, [root_key]: root_id },
              transaction,
            }),
          ),
        );
      }

      const insertedIDs = current.filter((value) => !previous.includes(value));
      if (insertedIDs.length) {
        operations.push(
          ...insertedIDs.map((id) =>
            model.create({ [key]: id, [root_key]: root_id }, { transaction }),
          ),
        );
      }

      return operations;
    }, [] as Promise<unknown>[]);

    return Promise.all(queries);
  }
}
