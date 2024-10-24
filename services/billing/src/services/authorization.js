import { createClient } from "soap";

export const documentAuthorization = async (accesKey, authorizationUrl) =>  {
  try {
    let params = { claveAccesoComprobante: accesKey };

    let authorizationResponse;

    const authorizationRequest = new Promise((resolve, reject) => {
      createClient(authorizationUrl, (err, client) => {
        if (err) {
          reject(err);
          return;
        }
        client.autorizacionComprobante(params, (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        });
      });
    });

    authorizationResponse = await authorizationRequest;

    return authorizationResponse;
  } catch (error) {
    console.log(error)
    return error
  }
}
