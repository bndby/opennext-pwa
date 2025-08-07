import JsBarcode from 'jsbarcode';
import { useEffect } from 'react';

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
    useEffect(() => {
        if (BARCODE_FORMATS[format]) {
            const barcodeElement = document.querySelector('.barcode');
            if (barcodeElement) {
                JsBarcode('.barcode').init();
            }
        }
    }, [barcode, format]);

    return (
        <svg
            className="barcode"
            jsbarcode-format={BARCODE_FORMATS[format]}
            jsbarcode-value={barcode}
            jsbarcode-textmargin="0"
            jsbarcode-fontoptions="bold"
        ></svg>
    );
};
