import JsBarcode from 'jsbarcode';
import { useEffect, useRef } from 'react';

export type BarcodePrintProps = {
    barcode: string;
    format: string;
};

export const BARCODE_FORMATS: { [key: string]: string } = {
    // aztec: 'aztec',
    code_128: 'CODE128',
    code_39: 'CODE39',
    // code_93: 'CODE93',
    codabar: 'codabar',
    // data_matrix: 'DATA_MATRIX',
    ean_13: 'EAN13',
    ean_8: 'EAN8',
    itf: 'ITF',
    // qr_code: 'QRCODE',
    upc_a: 'UPC',
    upc_e: 'UPC',
    // unknown: 'unknown',
};

export const BarcodePrint = ({ barcode, format }: BarcodePrintProps) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const barcodeFormat = BARCODE_FORMATS[format];

    useEffect(() => {
        if (!svgRef.current || !barcodeFormat) {
            return;
        }
        JsBarcode(svgRef.current, barcode, {
            format: barcodeFormat,
            textMargin: 0,
            fontOptions: 'bold',
        });
    }, [barcode, barcodeFormat]);

    return (
        <svg ref={svgRef} role="img" aria-label={`Штрихкод ${barcode}`}></svg>
    );
};
