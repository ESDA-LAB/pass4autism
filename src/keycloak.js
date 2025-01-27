import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'https://10.10.20.17:8443', // URL του Keycloak server
  realm: 'pass4autism',              // Το όνομα του Realm
  clientId: 'pass4autism-localhost-frontend',     // Το ID του client στο Keycloak
  enableLogging: true, // Προαιρετικό για debugging
});

export default keycloak;
