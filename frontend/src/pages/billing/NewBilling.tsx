import React, { useEffect, useState } from "react";
import { BillingType } from "../../types/BillingType";
import { TextInput, Button, Table, Label, Select, Modal } from "flowbite-react";
import { Product } from "../../types/ProductType";
import useProducts from "../../hooks/useProducts";
import { PagoType } from "../../types/PagoType";
import PagoModal from "../../components/PagoModal";

const NewBilling: React.FC = () => {
  const [formData, setFormData] = useState<BillingType>({
    infoTributaria: {
      ambiente: 0,
      tipoEmision: 1,
      razonSocial: "Mi Empresa S.A.",
      nombreComercial: "Mi Empresa",
      ruc: "1234567890",
      claveAcceso: "",
      codDoc: "01",
      estab: "001",
      ptoEmi: "",
      secuencial: "",
      dirMatriz: "Calle Falsa 123",
    },
    infoFactura: {
      fechaEmision: new Date().toISOString(),
      dirEstablecimiento: "El Ángel, Av. 10 de Agosto y Av. 6 de Diciembre",
      obligadoContabilidad: "Si",
      tipoIdentificacionComprador: "05",
      razonSocialComprador: "Gabriel Soto",
      identificacionComprador: "0401862388",
      direccionComprador: "El Ángel, Av. 10 de Agosto",
      totalSinImpuestos: 0,
      totalDescuento: 0,
      totalConImpuestos: {
        totalImpuesto: [
          {
            codigo: 1,
            codigoPorcentaje: 2,
            baseImponible: 0,
            valor: 0,
          },
        ],
      },
      propina: 0,
      importeTotal: 0,
      pagos: {
        pago: [
          //   {
          //     formaPago: "",
          //     total: 0,
          //     plazo: 0,
          //     unidadTiempo: "",
          //   }
        ],
      },
    },
    detalles: {
      detalle: [],
    },
    infoAdicional: {
      campoAdicional: [
        {
          _attributes: { nombre: "Teléfono" },
          _text: "0998463093",
        },
        {
          _attributes: { nombre: "Email" },
          _text: "juanga_esp@outlook.es",
        },
      ],
    },
    status: "",
    _id: "",
    xmlGenerated: "",
    xmlSigned: "",
  });

  type FormSections =
    | "infoTributaria"
    | "infoFactura"
    | "detalles"
    | "infoAdicional";

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formaPago, setFormaPago] = useState<PagoType>({
    formaPago: "",
    total: 0,
    plazo: 0,
    unidadTiempo: "",
  });
  const { products, loading, error } = useProducts(1, 10, searchTerm);

  useEffect(() => {
    if (searchTerm) {
      setSearchResults(products);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, products]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    section: FormSections,
    field: string,
    nombreCampo?: string, // Argumento adicional para el nombre del campo
  ) => {
    const value = e.target.value;
    if (
      section === "infoAdicional" &&
      field === "campoAdicional" &&
      nombreCampo
    ) {
      const newCampoAdicional = [...formData.infoAdicional.campoAdicional];
      const campoIndex = newCampoAdicional.findIndex(
        (campo) => campo._attributes.nombre === nombreCampo,
      );

      if (campoIndex !== -1) {
        // Actualizar el campo existente
        newCampoAdicional[campoIndex]._text = value;
      } else {
        // Agregar un nuevo campo
        newCampoAdicional.push({
          _attributes: { nombre: nombreCampo },
          _text: value,
        });
      }

      setFormData({
        ...formData,
        infoAdicional: {
          campoAdicional: newCampoAdicional,
        },
      });
    } else {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: value,
        },
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };
  const addProducto = (product: Product) => {
    setFormData({
      ...formData,
      detalles: {
        detalle: [
          ...formData.detalles.detalle,
          {
            codigoPrincipal: product.code,
            descripcion: product.name,
            codigoAuxiliar: "",
            cantidad: 1,
            precioUnitario: product.price,
            descuento: 0.0,
            precioTotalSinImpuesto: product.price,
            impuestos: {
              impuesto: {
                codigo: 1,
                codigoPorcentaje: 0,
                tarifa: product.tax,
                baseImponible: product.price,
                valor: 0.0,
              },
            },
          },
        ],
      },
    });
    setSearchTerm("");
  };

  const calculatePrice = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    type: string,
  ) => {
    const newDetalles = [...formData.detalles.detalle];

    if (type === "descuento") {
      const precioUnitario = newDetalles[index].precioUnitario;
      const cantidad = newDetalles[index].cantidad;
      newDetalles[index].descuento = parseInt(e.target.value);
      newDetalles[index].precioTotalSinImpuesto =
        (precioUnitario - parseInt(e.target.value)) * cantidad;
      setFormData({
        ...formData,
        detalles: { detalle: newDetalles },
      });
    } else {
      const precioUnitario = newDetalles[index].precioUnitario;
      const descuento = newDetalles[index].descuento;
      newDetalles[index].cantidad = parseInt(e.target.value);
      newDetalles[index].precioTotalSinImpuesto =
        (precioUnitario - descuento) * parseInt(e.target.value);
      setFormData({
        ...formData,
        detalles: { detalle: newDetalles },
      });
    }
  };

  const handleAddMetodoPago = (metodo: PagoType) => {
    formData.infoFactura.pagos.pago.push(metodo);
    setFormaPago({
      formaPago: "",
      total: 0,
      plazo: 0,
      unidadTiempo: "",
    });
    setShowModal(false);
  };
  return (
    <form onSubmit={handleSubmit}>
      {/* Sección del cliente */}
      <div className="mb-4 max-w-md space-y-2">
        <Label className="mb-2 text-xl font-bold">Factura</Label>
        <div className="mb-2 block">
          <Label htmlFor="estab" value="Establecimiento" />
        </div>
        <Select
          id="estab"
          required
          value={formData.infoTributaria.estab}
          onChange={(e) => handleChange(e, "infoTributaria", "estab")}
        >
          <option value={"001"}>001 - Pichincha y quinta trasversal</option>
          <option value={"002"}>002</option>
          <option value={"003"}>003</option>
          <option value={"004"}>004</option>
        </Select>
        <div className="mb-2 block">
          <Label htmlFor="fechaEmision" value="Fecha de emision" />
        </div>
        <TextInput
          id="fechaEmision"
          required
          type="text"
          placeholder="Fecha de Emisión"
          value={formData.infoFactura.fechaEmision}
          onChange={(e) => handleChange(e, "infoFactura", "fechaEmision")}
        />
        <div className="mb-2 block">
          <Label htmlFor="ptoEmi" value="Punto de emisión" />
        </div>
        <Select
          id="ptoEmi"
          required
          value={formData.infoTributaria.estab}
          onChange={(e) => handleChange(e, "infoTributaria", "estab")}
        >
          <option value={"001"}>001</option>
          <option value={"002"}>002</option>
          <option value={"003"}>003</option>
          <option value={"004"}>004</option>
        </Select>
        {/* Add more fields as needed */}
      </div>
      <div className="mb-4 space-y-6">
        <Label className="mb-2 text-xl font-bold">Adquiriente</Label>
        <div className="-mx-2 flex flex-wrap">
          <div className="mb-2 w-full px-2 md:w-1/2">
            <div className="mb-2 block">
              <Label htmlFor="identificacionComprador" value="Identificación" />
            </div>
            <TextInput
              id="identificacionComprador"
              type="text"
              required
              placeholder="Cédula / RUC / Pasaporte"
              value={formData.infoFactura.identificacionComprador}
              onChange={(e) =>
                handleChange(e, "infoFactura", "identificacionComprador")
              }
            />
          </div>
          <div className="mb-2 w-full px-2 md:w-1/2">
            <div className="mb-2 block">
              <Label
                htmlFor="tipoIdentificacionComprador"
                value="Tipo de Identificación"
              />
            </div>
            <Select
              id="tipoIdentificacionComprador"
              required
              value={formData.infoFactura.tipoIdentificacionComprador}
              onChange={(e) =>
                handleChange(e, "infoFactura", "tipoIdentificacionComprador")
              }
            >
              <option value={"01"}>RUC</option>
              <option value={"02"}>Pasaporte</option>
              <option value={"03"}>004</option>
              <option value={"05"}>Cédula</option>
            </Select>
          </div>
          <div className="mb-2 w-full px-2 md:w-1/2">
            <div className="mb-2 block">
              <Label htmlFor="razonSocialComprador" value="Razon social" />
            </div>
            <TextInput
              id="razonSocialComprador"
              required
              type="text"
              placeholder="Razon social"
              value={formData.infoFactura.razonSocialComprador}
              onChange={(e) =>
                handleChange(e, "infoFactura", "razonSocialComprador")
              }
            />
          </div>
          <div className="mb-2 w-full px-2 md:w-1/2">
            <div className="mb-2 block">
              <Label htmlFor="direccionComprador" value="Dirección" />
            </div>
            <TextInput
              id="direccionComprador"
              required
              type="text"
              placeholder="Razon social"
              value={formData.infoFactura.direccionComprador}
              onChange={(e) =>
                handleChange(e, "infoFactura", "direccionComprador")
              }
            />
          </div>
          <div className="mb-2 w-full px-2 md:w-1/2">
            <div className="mb-2 block">
              <Label htmlFor="telefonoComprador" value="Teléfono" />
            </div>
            <TextInput
              id="telefonoComprador"
              required
              type="text"
              placeholder="Teléfono"
              value={
                formData.infoAdicional.campoAdicional.find(
                  (campo) => campo._attributes.nombre === "Teléfono",
                )?._text || ""
              }
              onChange={(e) =>
                handleChange(e, "infoAdicional", "campoAdicional", "Teléfono")
              }
            />
          </div>
          <div className="mb-2 w-full px-2 md:w-1/2">
            <div className="mb-2 block">
              <Label htmlFor="emailComprador" value="Teléfono" />
            </div>
            <TextInput
              id="emailComprador"
              required
              type="text"
              placeholder="Email"
              value={
                formData.infoAdicional.campoAdicional.find(
                  (campo) => campo._attributes.nombre === "Email",
                )?._text || ""
              }
              onChange={(e) =>
                handleChange(e, "infoAdicional", "campoAdicional", "Email")
              }
            />
          </div>
          {/* Add more fields as needed */}
        </div>
      </div>
      {/* Sección de los productos */}
      <div className="mb-4">
        <Label className="mb-2 text-xl font-bold">Detalles</Label>
        <TextInput
          type="text"
          placeholder="Escriba una letra o palabra y despues seleccione el producto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchResults.length > 0 && (
          <div className="absolute z-10 mt-2 w-full rounded border border-gray-300 bg-white">
            {searchResults.map((product, index) => (
              <div
                key={index}
                className="cursor-pointer p-2 hover:bg-gray-200"
                onClick={() => addProducto(product)}
              >
                {product.code} - {product.name}
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 overflow-x-auto">
          <Table striped className="min-w-full">
            <Table.Head>
              <Table.HeadCell>Código</Table.HeadCell>
              <Table.HeadCell>Catidad</Table.HeadCell>
              <Table.HeadCell>Descripción</Table.HeadCell>
              <Table.HeadCell>Precio Unitario</Table.HeadCell>
              <Table.HeadCell>Tarifa</Table.HeadCell>
              <Table.HeadCell>Descuento</Table.HeadCell>
              <Table.HeadCell>Valor total</Table.HeadCell>
              <Table.HeadCell>Valor ICE</Table.HeadCell>
              <Table.HeadCell>Acciones</Table.HeadCell>
              {/* Add more columns as needed */}
            </Table.Head>
            <Table.Body className="divide-y">
              {formData.detalles.detalle.length > 0 ? (
                formData.detalles.detalle.map((detalle, index) => (
                  <Table.Row key={index} className="py-1">
                    <Table.Cell className="py-1">
                      <Label value={detalle.codigoPrincipal} />
                    </Table.Cell>
                    <Table.Cell className="py-1">
                      <TextInput
                        type="number"
                        placeholder="cantidad"
                        value={detalle.cantidad}
                        onChange={(e) => calculatePrice(e, index, "cantidad")}
                      />
                    </Table.Cell>
                    <Table.Cell className="py-1">
                      <Label value={detalle.descripcion} />
                    </Table.Cell>
                    <Table.Cell className="py-1">
                      <Label value={`${detalle.precioUnitario}`} />
                    </Table.Cell>
                    <Table.Cell className="py-1">
                      <Label value={`${detalle.impuestos.impuesto.tarifa}`} />
                    </Table.Cell>
                    <Table.Cell className="py-1">
                      <TextInput
                        type="number"
                        placeholder="descuento"
                        value={detalle.descuento}
                        onChange={(e) => calculatePrice(e, index, "descuento")}
                      />
                    </Table.Cell>
                    <Table.Cell className="py-1">
                      <Label value={`${detalle.precioTotalSinImpuesto}`} />
                    </Table.Cell>
                    <Table.Cell className="py-1">
                      <Label value={"0"} />
                    </Table.Cell>
                    <Table.Cell className="py-1">
                      <Button
                        color="failure"
                        onClick={() => {
                          const newDetalles = formData.detalles.detalle.filter(
                            (_, i) => i !== index,
                          );
                          setFormData({
                            ...formData,
                            detalles: { detalle: newDetalles },
                          });
                        }}
                      >
                        Eliminar
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={9} className="py-4 text-center">
                    No se han agregado productos
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>
      </div>

      {/* Sección de totales */}
      <div className="-mx-2 flex flex-wrap">
        {/* Columna izquierda: Métodos de pago e información adicional */}
        <div className="mb-4 w-full space-y-6 px-2 md:w-1/2">
          <Label className="mb-2 text-xl font-bold">Métodos de Pago</Label>
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <Table.Head>
                <Table.HeadCell>Método </Table.HeadCell>
                <Table.HeadCell>Valor</Table.HeadCell>
                <Table.HeadCell>Plazo</Table.HeadCell>
                <Table.HeadCell>Tiempo</Table.HeadCell>
                <Table.HeadCell>Acciones</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {formData.infoFactura.pagos.pago.length > 0 ? (
                  formData.infoFactura.pagos.pago.map((metodo, index) => (
                    <Table.Row key={index} className="py-1">
                      <Table.Cell className="py-1">
                        {metodo.formaPago}
                      </Table.Cell>
                      <Table.Cell className="py-1">{metodo.total}</Table.Cell>
                      <Table.Cell className="py-1">{metodo.plazo}</Table.Cell>
                      <Table.Cell className="py-1">
                        {metodo.unidadTiempo}
                      </Table.Cell>
                      <Table.Cell className="py-1">
                        <Button
                          color="failure"
                          onClick={() => {
                            const newDetalles =
                              formData.infoFactura.pagos.pago.filter(
                                (_, i) => i !== index,
                              );
                            setFormData({
                              ...formData,
                              infoFactura: {
                                ...formData.infoFactura,
                                pagos: { pago: newDetalles },
                              },
                            });
                          }}
                        >
                          Eliminar
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={5} className="py-4 text-center">
                      No se han agregado métodos de pago
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </div>

          <Button className="mt-2" onClick={() => setShowModal(true)}>
            Agregar Método de Pago
          </Button>

          {/* Modal para seleccionar métodos de pago */}
          <PagoModal
            show={showModal}
            pago={formaPago}
            onClose={() => setShowModal(false)}
            onSave={handleAddMetodoPago}
          />
          <div className="mb-2 block">
            <Label className="mb-2 mt-4 text-xl font-bold">
              Información Adicional
            </Label>
          </div>
          {formData.infoAdicional.campoAdicional.map((campo, index) => (
            <div key={index} className="mb-2">
              <TextInput
                type="text"
                placeholder={campo._attributes.nombre}
                value={campo._text}
                onChange={(e) =>
                  handleChange(
                    e,
                    "infoAdicional",
                    "campoAdicional",
                    campo._attributes.nombre,
                  )
                }
              />
            </div>
          ))}
        </div>

        {/* Columna derecha: Totales */}
        <div className="mb-4 w-full space-y-6 px-2 md:w-1/2">
          <Label className="mb-2 text-xl font-bold">Totales</Label>
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <Table.Head>
                <Table.HeadCell>Concepto</Table.HeadCell>
                <Table.HeadCell>Valor</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                <Table.Row className="py-1">
                  <Table.Cell className="py-1">
                    Subtotal sin impuestos:
                  </Table.Cell>
                  <Table.Cell className="py-1">
                    <label>{formData.infoFactura.totalSinImpuestos}</label>
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="py-1">
                  <Table.Cell className="py-1">Subtotal 15.00%:</Table.Cell>
                  <Table.Cell className="py-1">
                    <Label
                      value={formData.infoFactura.totalConImpuestos.totalImpuesto[0].valor.toString()}
                    />
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="py-1">
                  <Table.Cell className="py-1">Subtotal 5%:</Table.Cell>
                  <Table.Cell className="py-1">0.00</Table.Cell>
                </Table.Row>
                <Table.Row className="py-1">
                  <Table.Cell className="py-1">
                    Subtotal tarifa especial:
                  </Table.Cell>
                  <Table.Cell className="py-1">0.00</Table.Cell>
                </Table.Row>
                <Table.Row className="py-1">
                  <Table.Cell className="py-1">Subtotal 0%:</Table.Cell>
                  <Table.Cell className="py-1">0.00</Table.Cell>
                </Table.Row>
                <Table.Row className="py-1">
                  <Table.Cell className="py-1">
                    Subtotal no objeto de IVA:
                  </Table.Cell>
                  <Table.Cell className="py-1">0.00</Table.Cell>
                </Table.Row>
                <Table.Row className="py-1">
                  <Table.Cell className="py-1">
                    Subtotal exento de IVA:
                  </Table.Cell>
                  <Table.Cell className="py-1">0.00</Table.Cell>
                </Table.Row>
                <Table.Row className="py-1">
                  <Table.Cell className="py-1">Total descuento:</Table.Cell>
                  <Table.Cell className="py-1">0.00</Table.Cell>
                </Table.Row>
                <Table.Row className="py-1">
                  <Table.Cell className="py-1">Valor ICE:</Table.Cell>
                  <Table.Cell className="py-1">0.00</Table.Cell>
                </Table.Row>
                <Table.Row className="py-1">
                  <Table.Cell className="py-1">IVA 15.00% :</Table.Cell>
                  <Table.Cell className="py-1">75.00</Table.Cell>
                </Table.Row>
                <Table.Row className="py-1">
                  <Table.Cell className="py-1">IVA 5% :</Table.Cell>
                  <Table.Cell className="py-1">0.00</Table.Cell>
                </Table.Row>
                <Table.Row className="py-1">
                  <Table.Cell className="py-1">IVA tarifa especial:</Table.Cell>
                  <Table.Cell className="py-1">0.00</Table.Cell>
                </Table.Row>
                <Table.Row className="py-1">
                  <Table.Cell className="py-1">Propina 10%:</Table.Cell>
                  <Table.Cell className="py-1"></Table.Cell>
                </Table.Row>
                <Table.Row className="py-1">
                  <Table.Cell className="py-1">Valor a pagar:</Table.Cell>
                  <Table.Cell className="py-1">575.00</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>

      <Button type="submit">Generar Factura</Button>
    </form>
  );
};

export default NewBilling;
