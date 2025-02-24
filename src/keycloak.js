import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'https://sso.pass4autism-project.eu/', // URL του Keycloak server
  realm: 'pass4autism',              // Το όνομα του Realm
  clientId: 'pass4autism-frontend',     // Το ID του client στο Keycloak
  enableLogging: true, // Προαιρετικό για debugging
});

export default keycloak;
