import { AuthChecker } from "type-graphql";

import { IContext } from "../interfaces/server";

export const authChecker: AuthChecker<IContext> = (
  { context: { isAuthenticated, user } },
  roles
) => {
  const authenticated = isAuthenticated();
  if (!authenticated) return false;

  for (const role of roles) {
    switch (role) {
      case "admin": {
        return false;
      }
      default:
    }
  }
  return true;
};
