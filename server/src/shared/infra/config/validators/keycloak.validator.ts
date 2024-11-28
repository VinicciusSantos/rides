import { IsString } from 'class-validator';

import { IKeycloak } from '../../../domain';

export class KeycloakRules implements IKeycloak {
  @IsString()
  public api_url: string;

  @IsString()
  public realm: string;

  @IsString()
  public admin_username: string;

  @IsString()
  public admin_password: string;

  constructor(props: IKeycloak) {
    this.api_url = props.api_url;
    this.realm = props.realm;
    this.admin_username = props.admin_username;
    this.admin_password = props.admin_password;
  }
}
