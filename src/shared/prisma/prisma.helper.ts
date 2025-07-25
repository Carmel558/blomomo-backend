/* ****************************************************************
 * Gestion des connexions pour les entités sans le flag isDeleted *
 **************************************************************** */

export type ConnectResult<T, K extends string> = {
  connect: { [key in K]: T };
};

/**
 * Gère la connexion Prisma d'une entité à une autre
 * @param targetId Identifiant cible pour se connecter (foreign key)
 * @param keyName Nom de la propriété de connexion (usuellement 'id')
 * @returns L'objet de connexion formatté pour Prisma
 */
export const connect = <T, K extends string>(
  targetId: T | undefined,
  keyName: K
): ConnectResult<T, K> =>
  ({ connect: { [keyName]: targetId } } as {
    connect: { [key in K]: T };
  });

/**
 * Gère la connexion Prisma optionnelle d'une entité à une autre
 * @param targetId Identifiant cible pour se connecter (foreign key)
 * ou undefined pour ignorer l'étape
 * @param keyName Nom de la propriété de connexion (usuellement 'id')
 * @returns L'objet de connexion formatté pour Prisma ou undefined
 * si l'étape est ignorée
 */
export const optConnect = <T, K extends string>(
  targetId: T | null | undefined,
  keyName: K
): ConnectResult<T, K> | undefined => {
  if (!targetId) {
    return undefined;
  }

  return connect(targetId, keyName);
};

/**
 * Gère la déconnexion Prisma optionnelle d'une entité à une autre
 * @param targetId Identifiant cible pour se connecter, null pour se déconnecter
 * ou undefined pour passer l'étape
 * @param keyName Nom de la propriété de connexion (usuellement 'id')
 * @returns L'objet de connexion ou de déconnexion formatté pour Prisma,
 * ou undefined si l'étape est ignorée
 */
export const optDisconnect = <T, K extends string>(
  targetId: T | null | undefined,
  keyName: K
): ConnectResult<T, K> | { disconnect: true } | undefined => {
  if (targetId === null) {
    return { disconnect: true };
  }

  return optConnect(targetId, keyName);
};

/* *********************************************************************
 * Gestion des connexions pour les entités possédant le flag isDeleted *
 ********************************************************************* */

type ConnectIfExistsResult<T, K extends string> = {
  connect: {
    [key in `${K}_isDeleted`]: { [key2 in K]: T } & { isDeleted: boolean };
  };
};

/**
 * Gère la connexion Prisma d'une entité à une autre dans le cas d'une
 * entité possédant la propriété isDeleted
 * @param targetId Identifiant cible pour se connecter (foreign key)
 * @param keyName Nom de la propriété de connexion (usuellement 'id')
 * @returns L'objet de connexion formatté pour Prisma
 */
export const connectIfExists = <T, K extends string>(
  targetId: T,
  keyName: K
): ConnectIfExistsResult<T, K> =>
  ({
    connect: {
      [`${keyName}_isDeleted`]: { [keyName]: targetId, isDeleted: false },
    },
  } as ConnectIfExistsResult<T, K>);

/**
 * Gère la connexion Prisma optionnelle d'une entité à une autre
 * dans le cas d'une entité possédant la propriété isDeleted
 * @param targetId Identifiant cible pour se connecter (foreign key)
 * ou undefined pour ignorer l'étape
 * @param keyName Nom de la propriété de connexion (usuellement 'id')
 * @returns L'objet de connexion formatté pour Prisma ou undefined
 * si l'étape est ignorée
 */
export const optConnectIfExists = <T, K extends string>(
  targetId: T | null | undefined,
  keyName: K
): ConnectIfExistsResult<T, K> | undefined => {
  if (!targetId) {
    return undefined;
  }

  return connectIfExists(targetId, keyName);
};

/**
 * Gère la déconnexion Prisma optionnelle d'une entité à une autre
 * dans le cas d'une entité possédant la propriété isDeleted
 * @param targetId Identifiant cible pour se connecter, null pour se déconnecter
 * ou undefined pour passer l'étape
 * @param keyName Nom de la propriété de connexion (usuellement 'id')
 * @returns L'objet de connexion ou de déconnexion formatté pour Prisma,
 * ou undefined si l'étape est ignorée
 */
export const optDisconnectIfExists = <T, K extends string>(
  targetId: T | null | undefined,
  keyName: K
): ConnectIfExistsResult<T, K> | { disconnect: true } | undefined => {
  if (targetId === null) {
    return { disconnect: true };
  }

  return optConnectIfExists(targetId, keyName);
};
