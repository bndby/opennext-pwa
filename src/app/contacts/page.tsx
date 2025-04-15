import ContactsSupport from '@/components/Contacts/ContactsSupport';
import { Page } from '@/components/Page/Page';
import { Typography } from '@mui/material';
import { ContactsRead } from '@/components/Contacts/ContactsRead';

export default function MediaPage() {
    return (
        <Page title="Контакты">
            <Typography variant="h5">Контакты</Typography>

            <ContactsSupport />

            <p>
                Пример работы с{' '}
                <a href="https://developer.mozilla.org/en-US/docs/Web/API/Contact_Picker_API">контактами устройства</a>
            </p>

            <ContactsRead />
        </Page>
    );
}
