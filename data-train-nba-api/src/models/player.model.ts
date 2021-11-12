import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    mongodb: {collection: "players"}
  }
})
export class Player extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
    mongodb: {
      fieldName:"first_name"
    }
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
    mongodb: {
      fieldName:"last_name"
    }
  })
  lastName: string;

  @property.array(String, {
    name: 'seasons',
    required: true,
  })
  seasons: string[];

  constructor(data?: Partial<Player>) {
    super(data);
  }
}

export interface PlayerRelations {
  // describe navigational properties here
}

export type PlayerWithRelations = Player & PlayerRelations;
