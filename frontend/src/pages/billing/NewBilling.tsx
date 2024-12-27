import React, { useEffect, useState } from "react";
import { Billing } from "../../types/BillingType";
import { TextInput, Button, Table, Label, Select, Modal } from "flowbite-react";
import { Product } from "../../types/ProductType";
import useProducts from "../../hooks/useProducts";
import { PagoType } from "../../types/PagoType";
import PagoModal from "../../components/PagoModal";
import useBillings from "../../hooks/useBillins";
import { Invoice } from "../../types/InvoiceType";
import LoadModal from "../../components/LoadModal";
import SignedModal from "../../components/SignedModal";

const NewBilling: React.FC = () => {
  const [formData, setFormData] = useState<Billing>({
    infoTributaria: {
      ambiente: 1,
      tipoEmision: 1,
      razonSocial: "Mi Empresa S.A.",
      nombreComercial: "Mi Empresa",
      ruc: "0401862388001",
      claveAcceso: "",
      codDoc: "01",
      estab: "001",
      ptoEmi: "001",
      secuencial: "",
      dirMatriz: "Calle Falsa 123",
    },
    infoFactura: {
      fechaEmision: new Date().toISOString(),
      dirEstablecimiento: "El Ángel, Av. 10 de Agosto y Av. 6 de Diciembre",
      obligadoContabilidad: "SI",
      tipoIdentificacionComprador: "05",
      razonSocialComprador: "Vivian Soto",
      identificacionComprador: "0401862370",
      direccionComprador: "El Ángel, Av. 10 de Agosto",
      totalSinImpuestos: 0,
      totalDescuento: 0,
      totalConImpuestos: {
        totalImpuesto: [
          {
            codigo: 2,
            codigoPorcentaje: 4,
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
  });
  const [invoiceData, setInvoiceData] = useState<Invoice>();  

  const {saveBilling,signInvoice, loading, error} = useBillings(1,2,'');

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
  const { products} = useProducts(1, 10, searchTerm);
  const [showSingModal, setShowSingModal] = useState(false);

  useEffect(() => {
    if (searchTerm) {
      setSearchResults(products);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, products]);

  useEffect(() => {
    // Cargar datos desde localStorage cuando el componente se monte
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    calcularTotales();
  },[formData.detalles.detalle]);

  useEffect(() => {
      if (invoiceData?.invoice) {
        setFormData(invoiceData.invoice);
      }
    }, [invoiceData]);

  // Función para calcular los totales de la factura
  const calcularTotales = () => {
    let totalSinImpuestos = 0;
    let totalDescuento = 0;
    let totalIVA15 = 0;
    let totalIVA5 = 0;
    let totalTarifaEspecial = 0;

    formData.detalles.detalle.forEach((detalle) => {

      console.log(detalle.impuestos.impuesto.tarifa);
      totalSinImpuestos += detalle.cantidad * detalle.precioUnitario;
      totalDescuento += detalle.descuento;

      const tarifa = detalle.impuestos.impuesto.tarifa;
      const valor = detalle.impuestos.impuesto.valor;

      if (tarifa === 15) {
        totalIVA15 += valor;
      } else if (tarifa === 5) {
        totalIVA5 += valor;
      } else if (tarifa === 10) {
        totalTarifaEspecial += valor;
      }

      console.log(valor,"->");
    });

    
    const valorAPagar = totalSinImpuestos + totalIVA15 + totalIVA5 + totalTarifaEspecial - totalDescuento;

    setFormData((prevFormData) => ({
      ...prevFormData,
      infoFactura: {
        ...prevFormData.infoFactura,
        totalSinImpuestos,
        totalDescuento,
        totalConImpuestos: {
          totalImpuesto: [
            {
              codigo: 2,
              codigoPorcentaje: 4,
              baseImponible: totalSinImpuestos,
              valor: totalIVA15,
            },
          ],
        },
        importeTotal: parseFloat(valorAPagar.toFixed(3)), //parseFloat((product.price * (product.tax / 100)).toFixed(2)),
      },
    }));
    
  }

  // Función para manejar los cambios en los campos del formulario
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

  // Función para manejar el envío del formulario
  const handleSubmit = async () => {
    const data = await saveBilling(formData);
    console.log('factura',data);
    setInvoiceData(data.data);
  };

  //Abrir modal de firma
  const handleShowSingModal = () => {
    setShowSingModal(true);
  }

  //Cerrar modal de firma
  const handleCloseSingModal = () => {
    setShowSingModal(false);
  }

  // Función para firmar y enviar la factura
  const handleSignAndSend = async (file: File, password: string) => {
    // Lógica para firmar y enviar la factura
    if(invoiceData){
      const data = await signInvoice(file, password, invoiceData._id);
      console.log(data);
    }else{
      console.log('No se ha guardado la factura');
    }
  };

  // Función para agregar un producto a la factura
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
                codigoPorcentaje: 4,
                tarifa: product.tax,
                baseImponible: product.price,
                valor: parseFloat(
                  (product.price * (product.tax / 100)).toFixed(2),
                ),
              },
            },
          },
        ],
      },
    });
    setSearchTerm("");
  };

  // Función para calcular el precio total de un producto
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

  // Función para agregar un método de pago a la factura
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
    //Formulario de la factura
    <div>
      {/*Load Modal */}
      <LoadModal show={loading} />
      {/*Sign Modal */}
      <SignedModal show={showSingModal} onClose={handleCloseSingModal} onSave={handleSignAndSend} />
      {/* Sección de la empresa */}
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
      {/* Sección del cliente */}
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

      {/* Sección de totales, metodo de pago y campos adicionales*/}
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
                  <Table.Cell className="py-1">
                    {formData.infoFactura.totalDescuento}
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="py-1">
                  <Table.Cell className="py-1">Valor ICE:</Table.Cell>
                  <Table.Cell className="py-1">0.00</Table.Cell>
                </Table.Row>
                <Table.Row className="py-1">
                  <Table.Cell className="py-1">IVA 15.00% :</Table.Cell>
                  <Table.Cell className="py-1">
                    {
                      formData.infoFactura.totalConImpuestos.totalImpuesto[0]
                        .valor
                    }
                  </Table.Cell>
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
                  <Table.Cell className="py-1">
                    {formData.infoFactura.importeTotal}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>

      <div className="mb-4 flex space-x-2">
        <Button type="button" onClick={handleSubmit}>
          Guardar Factura
        </Button>
        <Button type="button" onClick={handleShowSingModal}>
          Firmar y Enviar
        </Button>
      </div>
    </div>
  );
};

export default NewBilling;
