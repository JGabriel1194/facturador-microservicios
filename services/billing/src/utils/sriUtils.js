import convert from "xml-js";
import fs from "fs";
import forge from "node-forge";

export const generateXML = (invoice) => {
  // Clonar el objeto para evitar referencias cíclicas
  const clonedInvoice = cloneDeep(invoice);

  // Eliminar todos los campos _id del objeto invoice
  const sanitizedInvoice = removeIds(clonedInvoice);

  //Convertimos de JSON a XML;
  // Generar el XML en base a los requisitos del SRI
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
           <factura  id="comprobante" version="1.0.0">
           ${convert.js2xml(sanitizedInvoice, {
             compact: true,
             ignoreComment: true,
             spaces: 4,
           })}
           </factura>`;

  return xml;
};

// Función para eliminar todos los campos _id de un objeto
const removeIds = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(removeIds);
  } else if (typeof obj === "object" && obj !== null) {
    const newObj = {};
    for (const key in obj) {
      if (key !== "_id") {
        newObj[key] = removeIds(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
};

// Función para clonar un objeto de manera profunda
const cloneDeep = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Función para leer un archivo .p12 y extraer el certificado y la clave privada
// // Función para obtener el archivo .p12 desde el sistema de archivos local
// async function getP12FromLocalFile(filePath) {
//   return fs.promises.readFile(filePath);
// }

export const getP12FromLocalFile = async (path) => {
  const file = fs.readFileSync(path);
  const buffer = file.buffer.slice(
    file.byteOffset,
    file.byteOffset + file.byteLength
  );
  return buffer;
};

// Función auxiliar para SHA1 Base64

const sha1Base64 = (text) => {
  const encoding = "utf8";
  let md = forge.md.sha1.create();
  md.update(text, encoding);
  const hash = md.digest().toHex();
  const buffer = Buffer.from(hash, "hex");
  const base64 = buffer.toString("base64");
  return base64;
};

// function sha1Base64(data) {
//   const md = forge.md.sha1.create();
//   md.update(data, "utf8");
//   return forge.util.encode64(md.digest().getBytes());
// }

//
function hexToBase64(hex) {
  hex = hex.padStart(hex.length + (hex.length % 2), "0");
  const bytes = hex.match(/.{2}/g).map((byte) => parseInt(byte, 16));
  return btoa(String.fromCharCode(...bytes));
}

// Función para convertir un BigInteger en Base64
// function bigIntToBase64(bigInt) {
//   return forge.util.encode64(forge.util.hexToBytes(bigInt.toString(16)));
// }

function bigIntToBase64(bigInt) {
  const hex = bigInt.toString(16);
  const hexPairs = hex.match(/\w{2}/g);
  const bytes = hexPairs.map((pair) => parseInt(pair, 16));
  const byteString = String.fromCharCode(...bytes);
  const base64 = btoa(byteString);
  const formatedBase64 = base64.match(/.{1,76}/g).join("\n");
  return formatedBase64;
}

//
function getRandomNumber(min = 990, max = 9999) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Función para firmar XML
// export async function signXML(p12FilePath, p12Password, xmlData) {
//   // Cargar el archivo .p12

//   const p12Buffer = fs.readFileSync(p12FilePath);
//   const p12Asn1 = forge.asn1.fromDer(forge.util.binary.raw.encode(p12Buffer));
//   const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, p12Password);

//   // Obtener clave privada y certificado
//   const keyBag = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })[
//     forge.pki.oids.pkcs8ShroudedKeyBag
//   ][0];
//   const certBag = p12.getBags({ bagType: forge.pki.oids.certBag })[
//     forge.pki.oids.certBag
//   ][0];
//   const privateKey = keyBag.key;
//   const certificate = certBag.cert;

//   // Preparar el XML original (reemplazar saltos de línea innecesarios)
//   let xml = xmlData.replace(/\s+/g, " ").trim();

//   // Digest del contenido XML
//   const xmlDigest = sha1Base64(xml);

//   // Generar SignedProperties
//   const signedProperties = `
//     <etsi:SignedProperties xmlns:etsi="http://uri.etsi.org/01903/v1.3.2#" Id="SignedProperties">
//       <etsi:SignedSignatureProperties>
//         <etsi:SigningTime>${new Date().toISOString()}</etsi:SigningTime>
//         <etsi:SigningCertificate>
//           <etsi:Cert>
//             <etsi:CertDigest>
//               <ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1" />
//               <ds:DigestValue>${sha1Base64(
//                 forge.asn1
//                   .toDer(forge.pki.certificateToAsn1(certificate))
//                   .getBytes()
//               )}</ds:DigestValue>
//             </etsi:CertDigest>
//             <etsi:IssuerSerial>
//               <ds:X509IssuerName>${certificate.issuer.attributes
//                 .map((attr) => `${attr.shortName}=${attr.value}`)
//                 .join(", ")}</ds:X509IssuerName>
//               <ds:X509SerialNumber>${parseInt(
//                 certificate.serialNumber,
//                 16
//               )}</ds:X509SerialNumber>
//             </etsi:IssuerSerial>
//           </etsi:Cert>
//         </etsi:SigningCertificate>
//       </etsi:SignedSignatureProperties>
//     </etsi:SignedProperties>`;

//   const signedPropertiesDigest = sha1Base64(signedProperties);

//   // Construir SignedInfo
//   const signedInfo = `
//     <ds:SignedInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
//       <ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315" />
//       <ds:SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1" />
//       <ds:Reference URI="">
//         <ds:Transforms>
//           <ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" />
//         </ds:Transforms>
//         <ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1" />
//         <ds:DigestValue>${xmlDigest}</ds:DigestValue>
//       </ds:Reference>
//       <ds:Reference URI="#SignedProperties">
//         <ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1" />
//         <ds:DigestValue>${signedPropertiesDigest}</ds:DigestValue>
//       </ds:Reference>
//     </ds:SignedInfo>`;

//   // Firmar SignedInfo
//   const canonicalSignedInfo = signedInfo.replace(/\s+/g, " ").trim();
//   const md = forge.md.sha1.create();
//   md.update(canonicalSignedInfo, "utf8");
//   const signatureValue = forge.util.encode64(privateKey.sign(md));

//   // Generar KeyInfo
//   const modulus = bigIntToBase64(privateKey.n);
//   const exponent = bigIntToBase64(privateKey.e);
//   const keyInfo = `
//     <ds:KeyInfo>
//       <ds:X509Data>
//         <ds:X509Certificate>${forge.pki
//           .certificateToPem(certificate)
//           .replace(/-----.*-----|\r?\n/g, "")}</ds:X509Certificate>
//       </ds:X509Data>
//       <ds:KeyValue>
//         <ds:RSAKeyValue>
//           <ds:Modulus>${modulus}</ds:Modulus>
//           <ds:Exponent>${exponent}</ds:Exponent>
//         </ds:RSAKeyValue>
//       </ds:KeyValue>
//     </ds:KeyInfo>`;

//   // Construir ds:Signature
//   const signature = `
//     <ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
//       ${signedInfo}
//       <ds:SignatureValue>${signatureValue}</ds:SignatureValue>
//       ${keyInfo}
//       <ds:Object>
//         ${signedProperties}
//       </ds:Object>
//     </ds:Signature>`;

//   // Insertar la firma en el XML (asegúrate de que se inserte al final del documento, justo antes de la etiqueta de cierre)
//   const signedXML = xml.replace(/(<\/[^<]+)$/, `${signature}$1`);

//   return signedXML;
// }


export async function signXML(p12FilePath, p12Password, xmlData) {
  const arrayBuffer = await getP12FromLocalFile(p12FilePath);

  let xml = xmlData;
  xml = xml.replace(/\s+/g, " ");
  xml = xml.trim();
  xml = xml.replace(/(?<=\>)(\r?\n)|(\r?\n)(?=\<\/)/g, "");
  xml = xml.trim();
  xml = xml.replace(/(?<=\>)(\s*)/g, "");

  const arrayUint8 = new Uint8Array(arrayBuffer);
  const base64 = forge.util.binary.base64.encode(arrayUint8);
  const der = forge.util.decode64(base64);

  const asn1 = forge.asn1.fromDer(der);
  const p12 = forge.pkcs12.pkcs12FromAsn1(asn1, p12Password);
  const pkcs8Bags = p12.getBags({
    bagType: forge.pki.oids.pkcs8ShroudedKeyBag,
  });
  const certBags = p12.getBags({
    bagType: forge.pki.oids.certBag,
  });
  const certBag = certBags[forge.oids.certBag];

  const friendlyName =
    certBag &&
    certBag[1] &&
    certBag[1].attributes &&
    certBag[1].attributes.friendlyName &&
    certBag[1].attributes.friendlyName[0];

  let certificate;
  let pkcs8;
  let issuerName = "";

  const cert = certBag.reduce((prev, curr) => {
    const attributes = curr.cert.extensions;
    return attributes.length > prev.cert.extensions.length ? curr : prev;
  }, certBag[0]);

  const issueAttributes = cert.cert ? cert.cert.issuer.attributes : [];

  issuerName = issueAttributes
    .reverse()
    .map((attribute) => {
      return `${attribute.shortName}=${attribute.value}`;
    })
    .join(", ");

  if (/BANCO CENTRAL/i.test(friendlyName)) {
    let keys = pkcs8Bags[forge.oids.pkcs8ShroudedKeyBag];
    for (let i = 0; i < keys.length; i++) {
      const element = keys[i];
      let name = element.attributes.friendlyName[0];
      if (/Signing Key/i.test(name)) {
        pkcs8 = pkcs8Bags[forge.oids.pkcs8ShroudedKeyBag[i]];
      }
    }
  }

  if (/SECURITY DATA/i.test(friendlyName)) {
    pkcs8 = pkcs8Bags[forge.oids.pkcs8ShroudedKeyBag][0];
  }

  certificate = cert.cert;

  const notBefore = certificate.validity["notBefore"];
  const notAfter = certificate.validity["notAfter"];
  const date = new Date();

  if (date < notBefore || date > notAfter) {
    throw new Error("Expired certificate");
  }

  const key = pkcs8.key ?? pkcs8.asn1;
  const certificateX509_pem = forge.pki.certificateToPem(certificate);

  let certificateX509 = certificateX509_pem;
  certificateX509 = certificateX509.substr(certificateX509.indexOf("\n"));
  certificateX509 = certificateX509.substr(
    0,
    certificateX509.indexOf("\n-----END CERTIFICATE-----")
  );

  certificateX509 = certificateX509
    .replace(/\r?\n|\r/g, "")
    .replace(/([^\0]{76})/g, "$1\n");

  const certificateX509_asn1 = forge.pki.certificateToAsn1(certificate);
  const certificateX509_der = forge.asn1.toDer(certificateX509_asn1).getBytes();
  const hash_certificateX509_der = sha1Base64(certificateX509_der, "utf8");
  const certificateX509_serialNumber = parseInt(certificate.serialNumber, 16);

  const exponent = hexToBase64(key.e.data[0].toString(16));
  const modulus = bigIntToBase64(key.n);

  xml = xml.replace(/\t|\r/g, "");

  const sha1_xml = sha1Base64(
    xml.replace('<?xml version="1.0" encoding="UTF-8"?>', ""),
    "utf8"
  );

  const nameSpaces =
    'xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:etsi="http://uri.etsi.org/01903/v1.3.2#"';

  const certificateNumber = getRandomNumber();
  const signatureNumber = getRandomNumber();
  const signedPropertiesNumber = getRandomNumber();
  const signedInfoNumber = getRandomNumber();
  const signedPropertiesIdNumber = getRandomNumber();
  const referenceIdNumber = getRandomNumber();
  const signatureValueNumber = getRandomNumber();
  const objectNumber = getRandomNumber();

  const isoDateTime = date.toISOString().slice(0, 19);

  let signedProperties = "";
  signedProperties +=
    '<etsi:SignedProperties Id="Signature' +
    signatureNumber +
    "-SignedProperties" +
    signedPropertiesNumber +
    '">';

  signedProperties += "<etsi:SignedSignatureProperties>";
  signedProperties += "<etsi:SigningTime>";
  signedProperties += isoDateTime;
  signedProperties += "</etsi:SigningTime>";
  signedProperties += "<etsi:SigningCertificate>";
  signedProperties += "<etsi:Cert>";
  signedProperties += "<etsi:CertDigest>";
  signedProperties +=
    '<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
  signedProperties += "</ds:DigestMethod>";
  signedProperties += "<ds:DigestValue>";
  signedProperties += hash_certificateX509_der;
  signedProperties += "</ds:DigestValue>";
  signedProperties += "</etsi:CertDigest>";
  signedProperties += "<etsi:IssuerSerial>";
  signedProperties += "<ds:X509IssuerName>";
  signedProperties += issuerName;
  signedProperties += "</ds:X509IssuerName>";
  signedProperties += "<ds:X509SerialNumber>";
  signedProperties += certificateX509_serialNumber;
  signedProperties += "</ds:X509SerialNumber>";
  signedProperties += "</etsi:IssuerSerial>";
  signedProperties += "</etsi:Cert>";
  signedProperties += "</etsi:SigningCertificate>";
  signedProperties += "</etsi:SignedSignatureProperties>";

  signedProperties += "<etsi:SignedDataObjectProperties>";
  signedProperties +=
    '<etsi:DataObjectFormat ObjectReference="#Reference-ID=' +
    referenceIdNumber +
    '">';
  signedProperties += "<etsi:Description>";
  signedProperties += "contenido comprobante";
  signedProperties += "</etsi:Description>";
  signedProperties += "<etsi:MimeType>";
  signedProperties += "text/xml";
  signedProperties += "</etsi:MimeType>";
  signedProperties += "</etsi:DataObjectFormat>";
  signedProperties += "</etsi:SignedDataObjectProperties>";
  signedProperties += "</etsi:SignedProperties>";

  const sha1SignedProperties = sha1Base64(
    signedProperties.replace(
      "<ets:SignedProperties",
      "<etsi:SignedProperties " + nameSpaces
    ),
    "utf8"
  );

  let keyInfo = "";
  keyInfo += '<ds:KeyInfo Id="Certificate' + certificateNumber + '">';
  keyInfo += "\n<ds:X509Data>";
  keyInfo += "\n<ds:X509Certificate>\n";
  keyInfo += certificateX509;
  keyInfo += "\n</ds:X509Certificate>";
  keyInfo += "\n</ds:X509Data>";
  keyInfo += "\n<ds:KeyValue>";
  keyInfo += "\n<ds:RSAKeyValue>";
  keyInfo += "\n<ds:Modulus>\n";
  keyInfo += modulus;
  keyInfo += "\n</ds:Modulus>";
  keyInfo += "\n<ds:Exponent>\n";
  keyInfo += exponent;
  keyInfo += "\n</ds:Exponent>";
  keyInfo += "\n</ds:RSAKeyValue>";
  keyInfo += "\n</ds:KeyValue>";
  keyInfo += "\n</ds:KeyInfo>";

  const sha1KeyInfo = sha1Base64(
    keyInfo.replace("<ds:KeyInfo", "<ds:KeyInfo " + nameSpaces),
    "utf8"
  );

  let signedInfo = "";
  signedInfo +=
    '<ds:SignedInfo Id="Signature-SignedInfo' + signedInfoNumber + '">';
  signedInfo +=
    '\n<ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315">';
  signedInfo += "</ds:CanonicalizationMethod>";
  signedInfo +=
    '\n<ds:SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1">';
  signedInfo += "</ds:SignatureMethod>";
  signedInfo +=
    '\n<ds:Reference Id="SignedPropertiesID' +
    signedPropertiesIdNumber +
    '" Type="http://uri.etsi.org/01903#SignedProperties" URI="#Signature' +
    signatureNumber +
    "-SignedProperties" +
    signedPropertiesNumber +
    '">';
  signedInfo +=
    '\n<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
  signedInfo += "</ds:DigestMethod>";
  signedInfo += "\n<ds:DigestValue>";
  signedInfo += sha1SignedProperties;
  signedInfo += "</ds:DigestValue>";
  signedInfo += "\n</ds:Reference>";
  signedInfo += '\n<ds:Reference URI="#Certificate' + certificateNumber + '">';
  signedInfo +=
    '\n<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
  signedInfo += "</ds:DigestMethod>";
  signedInfo += "\n<ds:DigestValue>";
  signedInfo += sha1KeyInfo;
  signedInfo += "</ds:DigestValue>";
  signedInfo += "\n</ds:Reference>";

  signedInfo +=
    '\n<ds:Reference Id="Reference-ID' +
    referenceIdNumber +
    '" URI="#comprobante">';
  signedInfo += "\n<ds:Transforms>";
  signedInfo +=
    '\n<ds:Transform Algorithm="http://www.w3.org/2000/09/xmlndsig#enveloped-signature">';
  signedInfo += "</ds:Transform>";
  signedInfo += "\n</ds:Transforms>";
  signedInfo +=
    '\n<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
  signedInfo += "</ds:DigestMethod>";
  signedInfo += "\n<ds:DigestValue>";
  signedInfo += sha1_xml;
  signedInfo += "</ds:DigestValue>";
  signedInfo += "\n</ds:Reference>";

  signedInfo += "\n</ds:SignedInfo>";

  const canonicalizedSignedInfo = signedInfo.replace(
    "<ds:SignedInfo",
    "<ds:SignedInfo " + nameSpaces
  );

  const md = forge.md.sha1.create();
  md.update(canonicalizedSignedInfo, "utf8");

  const signature = btoa(
    key
      .sign(md)
      .match(/.{1,76}/g)
      .join("\n")
  );

  let xadesBes = "";
  xadesBes +=
    "<ds:Signature " + nameSpaces + ' Id="Signature' + signatureNumber + '">';
  xadesBes += "\n" + signedInfo;

  xadesBes +=
    '\n<ds:SignatureValue Id="SignatureValue' + signatureValueNumber + '">\n';

  xadesBes += signature;
  xadesBes += "\n</ds:SignatureValue>";
  xadesBes += "\n" + keyInfo;
  xadesBes +=
    '\n<ds:Object Id="Signature' +
    signatureNumber +
    "-Object" +
    objectNumber +
    '">';

  xadesBes +=
    '<etsi:QualifyingProperties Target="#Signature' + signatureNumber + '">';
  xadesBes += signedProperties;

  xadesBes += "</etsi:QualifyingProperties>";
  xadesBes += "</ds:Object>";
  xadesBes += "</ds:Signature>";

  return xml.replace(/(<[^<]+)$/, xadesBes + "$1");
}