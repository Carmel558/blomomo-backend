import { AuthorizedRequest } from "../../../shared/type/request.type";

export interface UserRequest extends AuthorizedRequest {
  user: {
    email: string;
    azureId: string;
  };
}
