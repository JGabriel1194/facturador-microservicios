import { createClient } from "soap";

export const documentReception = async (stringXML, receptionUrl) => {
  try {
    const base64XML = Buffer.from(stringXML).toString("base64");
    let params = { xml: base64XML };

    let receptionResult;

    const receptionRequest = new Promise((resolve, reject) => {
      createClient(receptionUrl, (err, client) => {
        
        if (err) {
          reject(err);
          return;
        }
        client.validarComprobante(params, (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        });
      });
    });

    receptionResult = await receptionRequest;
    return receptionResult;
  } catch (error) {
    return error
  }
}
