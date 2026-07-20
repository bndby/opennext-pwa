'use client';

interface ContactAddress {
    readonly addressLine?: string[];
    readonly country?: string;
    readonly city?: string;
    readonly dependentLocality?: string;
    readonly organization?: string;
    readonly phone?: string;
    readonly postalCode?: string;
    readonly recipient?: string;
    readonly region?: string;
    readonly sortingCode?: string;
}

interface Contact {
    address?: ContactAddress[];
    email?: string[];
    icon?: Blob[];
    name?: string[];
    tel?: string[];
}

interface ContactsManager {
    getProperties(): Promise<string[]>;
    select(props: string[], options: { multiple: boolean }): Promise<Contact[]>;
}

declare global {
    interface Navigator {
        contacts?: ContactsManager;
    }
    interface Window {
        ContactsManager?: { new (): ContactsManager };
    }
}

import { Button, Table, TableCell, TableRow, TableHead, TableBody } from '@mui/material';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useBrowserSupport } from '@/hooks/useBrowserSupport';
import { useClientSide } from '@/hooks/useClientSide';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';

function formatAddress(address: ContactAddress): string {
    const parts = [
        ...(address.addressLine ?? []),
        address.city,
        address.region,
        address.postalCode,
        address.country,
        address.organization,
        address.recipient,
    ].filter(Boolean);

    return parts.join(', ');
}

function ContactIcon({ blob, alt }: { blob: Blob; alt: string }) {
    const [src, setSrc] = useState<string | null>(null);

    useEffect(() => {
        const url = URL.createObjectURL(blob);
        setSrc(url);
        return () => {
            URL.revokeObjectURL(url);
        };
    }, [blob]);

    if (!src) return null;

    return <Image src={src} alt={alt} width={36} height={36} unoptimized />;
}

function ContactsReadInner() {
    const [availableProps, setAvailableProps] = useState<string[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const isClient = useClientSide();
    const isSupported = useBrowserSupport('contacts');

    useEffect(() => {
        const fetchProps = async () => {
            if (!isSupported) return;
            try {
                const props = await navigator.contacts?.getProperties();
                setAvailableProps(props || []);
            } catch (error) {
                console.error('Ошибка при получении свойств контактов:', error);
            }
        };

        void fetchProps();
    }, [isSupported]);

    const handleReadContacts = async () => {
        if (!isSupported) {
            alert('Contacts API не поддерживается в вашем браузере');
            return;
        }

        try {
            const selected = await navigator.contacts?.select(availableProps, { multiple: true });
            setContacts(selected || []);
        } catch (error) {
            console.error('Ошибка при чтении контактов:', error);
        }
    };

    if (!isClient) {
        return <div>Загрузка...</div>;
    }

    return (
        <div>
            <Button onClick={handleReadContacts} variant="contained" disabled={!isSupported}>
                Выбрать контакты
            </Button>
            {!isSupported && <p style={{ color: 'red' }}>Contacts API не поддерживается в вашем браузере</p>}
            {availableProps.length > 0 && (
                <div>
                    <h3>Доступные поля:</h3>
                    <p>{availableProps.join(', ')}</p>
                </div>
            )}
            {contacts.length > 0 && (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Иконка</TableCell>
                            <TableCell>Имя, Телефон</TableCell>
                            <TableCell>Email, Адрес</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contacts.map((contact, index) => {
                            const name = (contact.name ?? []).join(', ');
                            const tel = (contact.tel ?? []).join(', ');
                            const email = (contact.email ?? []).join(', ');
                            const address = (contact.address ?? []).map(formatAddress).filter(Boolean).join('; ');
                            const rowKey = [name, tel, email, String(index)].filter(Boolean).join('|') || `contact-${index}`;

                            return (
                                <TableRow key={rowKey}>
                                    <TableCell>
                                        {contact.icon && contact.icon.length > 0 && (
                                            <ContactIcon blob={contact.icon[0]} alt={name || 'Contact Icon'} />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {name}
                                        <br />
                                        {tel}
                                    </TableCell>
                                    <TableCell>
                                        {email}
                                        <br />
                                        {address}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}

export const ContactsRead = () => (
    <ErrorBoundary title="Ошибка Contacts API">
        <ContactsReadInner />
    </ErrorBoundary>
);
