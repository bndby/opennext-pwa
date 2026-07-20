/**
 * Декодирует полезную нагрузку NDEF-записи в читаемую строку.
 */
export function decodeNdefRecordData(record: {
    recordType?: string;
    mediaType?: string | null;
    data?: DataView | ArrayBuffer | null;
    encoding?: string | null;
    lang?: string | null;
}): string {
    if (!record.data) {
        return '';
    }

    const dataView =
        record.data instanceof DataView
            ? record.data
            : new DataView(record.data);

    const encoding = record.encoding || 'utf-8';

    try {
        return new TextDecoder(encoding).decode(dataView);
    } catch {
        const bytes = Array.from({ length: dataView.byteLength }, (_, i) =>
            dataView.getUint8(i).toString(16).padStart(2, '0'),
        );
        return bytes.join(' ');
    }
}

export function formatNdefMessage(
    records: Array<{
        recordType?: string;
        mediaType?: string | null;
        data?: DataView | ArrayBuffer | null;
        encoding?: string | null;
    }>,
): string {
    if (!records.length) {
        return '(пустое NDEF-сообщение)';
    }

    return records
        .map((record, index) => {
            const type = record.recordType || 'unknown';
            const media = record.mediaType ? ` (${record.mediaType})` : '';
            const payload = decodeNdefRecordData(record);
            return `[${index}] ${type}${media}: ${payload}`;
        })
        .join('\n');
}
